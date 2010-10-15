/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

/**
 * Module dependencies
 */
var fs = require('fs');

/**
 * Meryl core object
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
   * Default encoding
   */   
   _encoding: 'utf-8',
   
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
   * Function for defining a custom error handler
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
   * Function for defining a custom not found handler
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
   * This function renders source string with given data which uses
   * John Ressig's micro templating implementation of underscore.js
   *
   * @param {String} source
   * @return {Object} data
   * @api private
   */
  _microtemplate: function (source, data) {
    var endMatch = new RegExp("'(?=[^\%]*\%\>)", "g");
    return new Function('obj',
      'var p=[],print=function(){p.push.apply(p,arguments);};with(obj||{}){p.push(\''
      + source.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t')
        .replace(endMatch, "✄").split("'").join("\\'").split("✄").join("'")
        .replace(/<%=(.+?)%>/g, "',$1,'").split("<%").join("');").split("\%\>")
        .join("p.push('")
      + "');}return p.join('');")(data);
  },

  /*
   * This function renders given template name using rendering options
   * with given data
   *
   * @param {String} templateName
   * @return {Object} data
   * @api private
   */
  _render: function (templateName, data) {
    var templateDir = this.options.templateDir ? this.options.templateDir + "/" :"",
      templateExt = this.options.templateExt || '.jshtml',
      templateFunc = this.options.templateFunc || this._microtemplate,
      templatePath = templateDir + templateName + templateExt;
    return templateFunc(fs.readFileSync(templatePath, this._encoding), data);
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
    self.options = opts || {};
    var infra = self.plugins.concat(self.handlers);
    infra.push({pattern:
       "*", cb: self._notFoundHandler});
    return function (req, resp) {
      req.params = require('url').parse(req.url, true);
      resp.headers = {'content-type': 'text/html'};
      resp.status = 200;
      resp.send = function (data, encoding) {
          this.writeHead(this.status, this.headers);
          this.end(data, encoding || self._encoding);
      };
      function render (templateName, data) {
        var data = data || {};
        data.request = req;
        data.response = resp;
        data.render = render;
        return self._render(templateName, data);
      }
      resp.render = function (templateName, data) {
        resp.send(render(templateName, data));
      };
      req.addListener('data', function (data) {
        if (!req.postdata) {
          req.postdata = data;
        } else {
          req.postdata += data;
        }
      }).addListener('end', function () {
        self._proc(infra, self, req, resp);
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
  run: function (opts) {
    var opts = opts || {};
    require('http').createServer(this.cgi(opts)).listen(
      opts.port || process.env.PORT || 3000,
      opts.hostname || process.env.HOSTNAME || 'localhost');
  },
  
  /*
   * Funny helper function for constructing Meryl applications
   * in (fab) flavored style
   */
  fabby: function () {
    var self = this;
    function contextCarrier () {
      if(!arguments.length
          || (arguments.length == 1 && typeof arguments[0] == 'object')) {
        self.run(arguments[0] || {});
      } else {
        self.plug.apply(self, arguments);
        return contextCarrier;
      }
    }
    return contextCarrier.apply(self, arguments);
  }
}

/*
 * export Meryl as a pre-instanciated instance
 */
module.exports = new Meryl;

