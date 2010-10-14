/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

var Meryl = function () {
  // handler registry
  this.handlers = [];
  // plugin registry
  this.plugins = [];
  
  // Aliases
  this.h = this.handle;
  this.p = this.plug;
}

Meryl.prototype = {
   
  /*
   * Default not found handler definition
   *
   * @param {Object} req
   * @param {Object} resp
   * @api private
   */
   _notFoundHandler: function (req, resp) {
     if (resp.status >= 200 && resp.status < 300) resp.status = 404;
     resp.send('<h3>Not Found</h3><pre>'
      + req.params.pathname
      + '</pre>');
   },

  /*
   * Default error handler definition
   *
   * @param {Object} req
   * @param {Object} resp
   * @return {Object} e
   * @api private
   */
   _errorHandler: function (req, resp, e) {
     if (resp.status >= 200 && resp.status < 300) resp.status = 500;
     resp.send('<h3>Server error</h3><pre>'
      + ((e instanceof Error && this.options.debug) ? e.stack : e)
      + '</pre>');
   },

  /*
   * Parses path expression and extract path variables
   *
   * @param {String} expr
   * @param {String} path
   * @return {Object}
   * @api private
   */
  _parsePath: function (expr, path) {
    var p1 = "{([^}]+)}",
        p2 = "<([^>]+)>",
        rA = new RegExp("(?:" + p1 + ")|(?:" + p2 + ")", "gi"),
        keys = [],
        values = null,
        capture = null;
    while (capture = rA.exec(expr)) {
      keys.push(capture[1] || capture[2]);
    }
    var rB = new RegExp("^"
      + expr.replace(/\(/, "(?:", "gi")
            .replace(/\./, "\\\.", "gi")
            .replace(/\*/, ".*", "gi")
            .replace(new RegExp(p1, "gi"), "([^/\.\?]+)")
            .replace(new RegExp(p2, "gi"), "(.+)")
      + "$");
    if (values = rB.exec(path)) {
      var result = {};
      values.shift();
      if (values.length === keys.length) {
        for (var i in keys) {
          result[keys[i]] = values[i];
        }
      } else {
      	throw new Error('Inconsistent path expression');
      }
      return result;
    }
    return null;
  },

  /*
   * Process incoming requests and do main routing
   * operations through handlers and plugins by chaining matched
   * ones with each other
   *
   * @param {Array} infra
   * @param {Object} req
   * @param {Object} resp
   * @return {undefined}
   * @api private
   */
  _proc: function (infra, ctx, req, resp) {
    var self = this;
    var i = 0;
    function next() {
      var procunit = infra[i++];
      if (procunit && procunit.pattern) {
        var parts = self._parsePath(procunit.pattern, req.method
          + ' ' + req.params.pathname);
        if (parts) {
          if (procunit.cb) {
            for (var key in parts)
              req.params[key] = parts[key];
            for (var key in req.params.query)
              req.params[key] = req.params.query[key];
            procunit.cb.call(ctx, req, resp, next);
          }
        } else {
          next();
        }
      }
    }
    try {
      next();
    } catch (e) {
      if (this._errorHandler) {
        this._errorHandler.call(ctx, req, resp, e);
      } else {
        throw e;
      }
    }
  },
  
  /*
   * Handler registration function
   *
   * @param {String} pattern
   * @param {Function} callback
   * @return {Object} this
   * @api public
   */
  handle: function (pattern, callback) {
    this.handlers.push({pattern: pattern, cb: callback});
    return this;
  },

  /*
   * Plugin registration function
   *
   * @param {Array} [pattern ,] callbacks
   * @return {Object} this
   * @api public
   */
  plug: function () {
    var args = Array.prototype.slice.call(arguments);
    var first = args.shift();
    var pattern = "*", callback = first;
    if(typeof first === 'string') {
      pattern = first;
      callback = args.shift();
    }
    do {
      this.plugins.push({pattern: pattern, cb: callback});
    } while ((callback = args.shift()));
    return this;
  },

  /*
   * Function for defining custom error handlers
   *
   * @param {Function} callback
   * @return {Object} this
   * @api public
   */
  handleError: function (callback) {
    this._errorHandler = callback;
    return this;
  },

  /*
   * Function for defining custom resource not found handler
   *
   * @param {Function} callback
   * @return {Object} this
   * @api public
   */
  handleNotFound: function (callback) {
    this._notFoundHandler = callback;
    return this;
  },

  /*
   * Main entry point of Meryl. It pushes some initial
   * preperations for handling http requests.
   *
   * Examples:
   *
   *  require('http').createServer(meryl.cgi()).listen(3000);
   *
   * @return {Function}
   * @api public
   */
  cgi: function (opts) {
    var self = this;
    var ctx = {options: opts || {}};
    var infra = this.plugins.concat(this.handlers);
    infra.push({pattern:
       "*", cb: this._notFoundHandler});
    return function (req, resp) {
      req.params = require('url').parse(req.url, true);
      resp.headers = {'content-type': 'text/html'};
      resp.status = 200;
      resp.send = function (data, enc) {
          this.writeHead(this.status, this.headers);
          this.end(data, enc || 'utf-8');
      };
      req.addListener('data', function (data) {
        if (!req.postdata) {
          req.postdata = data;
        } else {
          req.postdata += data;
        }
      }).addListener('end', function () {
        self._proc(infra, ctx, req, resp);
      });
    };
  },
  
  /*
   * A simple factory to able to create multiple
   * distinct Meryl instances outside module
   */
  factory: function () {
    return new Meryl;
  },
  
  /*
   * Shorthand helper function for running Meryl
   * instantly using inner cgi
   * @param {Number} port
   * @param {String} hostname
   * @api public
   */
  run: function (port, hostname) {
    require('http').createServer(this.cgi()).listen(
      port || process.env.PORT || 3000,
      hostname || process.env.HOSTNAME || 'localhost');
  }
}

/*
 * export Meryl as a pre-instanciated instance
 */
module.exports = new Meryl;
