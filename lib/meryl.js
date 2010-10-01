/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

/*
 * Modules dependencies
 */
var sys = require('sys'),
    url = require('url');

/*
 * Variable definitions.
 */
var handlers = [],  // Handler registry
    plugins = [], // Plugin Registry
    notFoundHandler = function (req, resp) { // Default 404 not found handler
      if (resp.status >= 200 && resp.status < 300) resp.status = 404;
      resp.send('<h3>Not Found</h3><pre>'
        + resp.params.pathname
        + '</pre>');
    },
    errorHandler = function (req, resp, e) { // Default 500 error handler
      if (resp.status >= 200 && resp.status < 300) resp.status = 500;
      resp.send('<h3>Server error</h3><pre>'
        + ((e instanceof Error && module.exports.debug) ? e.stack : e)
        + '</pre>');
    };

/*
 * Parses path expression and extract path variables
 *
 * @param {String} expr
 * @param {String} path
 * @return {Object}
 * @api private
 */
var parsePath = function (expr, path) {
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
    if (values.length == keys.length) {
      for (var i in keys) {
        result[keys[i]] = values[i];
      }
    }
    return result;
  }
  return null;
};

/*
 * Process incoming requests and do main routing
 * operations through handlers and plugins by chaining matched
 * ones with each other
 *
 * @param {Array} infra
 * @param {Object} ctx
 * @param {Object} req
 * @param {Object} resp
 * @return {undefined}
 * @api private
 */
function proc(infra, req, resp) {
  var i = 0;
  function next() {
    var procunit = infra[i++];
    if (procunit && procunit.pattern) {
      var parts = parsePath(procunit.pattern, req.method
        + ' ' + req.params.pathname);
      if (parts) {
        if (procunit.cb) {
          for (var key in parts)
            req.params[key] = parts[key];
          for (var key in req.params.query)
            req.params[key] = req.params.query[key];
          procunit.cb(req, resp, next);
        }
      } else {
        next();
      }
    }
  }
  try {
    next();
  } catch (e) {
    if (errorHandler) {
      errorHandler(req, resp, e);
    } else {
      throw e;
    }
  }
}

var Meryl = function() {
  // Aliases
  this.h = this.handle;
  this.p = this.plug;
  this.errHnd = this.errorHandler;
  this.notFndHnd = this.notFound = this.notFoundHandler;
}

Meryl.prototype = {
  /*
   * Handler registration function
   *
   * @param {String} pattern
   * @param {Function} cb
   * @return {Object} this
   * @api public
   */
  handle: function (pattern, cb) {
    handlers.push({pattern: pattern, cb: cb});
    return this;
  },

  /*
   * Plugin registration function
   *
   * @param {String} key
   * @param {Object} value
   * @return {Object} this
   * @api public
   */
  plug: function (pattern, cb) {
    if (typeof pattern === 'function')
      plugins.push({pattern: "*", cb: pattern});
    else 
      plugins.push({pattern: pattern, cb: cb});
    return this;
  },

  /*
   * Function for defining custom error handlers
   *
   * @param {Function} cb
   * @return {Object} this
   * @api public
   */
  errorHandler: function (cb) {
    errorHandler = cb;
    return this;
  },

  /*
   * Function for defining custom resource not found handler
   *
   * @param {Function} cb
   * @return {Object} this
   * @api public
   */
  notFoundHandler: function (cb) {
    notFoundHandler = cb;
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

  cgi: function () {
    var infra = plugins.concat(handlers);
    infra.push({pattern: "*", cb: notFoundHandler});
    return function (req, resp) {
      req.params = url.parse(req.url, true);
      resp.headers = {'Content-Type': 'text/html'};
      resp.status = 200;
      resp.send = function (data, enc) {
          this.writeHead(this.status, this.headers);
          this.end(data, enc || 'utf-8');
      };
      req.addListener('data', function (data) {
        resp.postdata = data;
      }).addListener('end', function () {
        proc(infra, req, resp);
      });
    };
  }
}

module.exports = new Meryl;
