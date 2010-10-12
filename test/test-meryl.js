var meryl = require('./../index').factory,
  http = require('./fixtures/httputil'),
  async = require('async');

exports.testDefaultNotFoundHandler = function (test) {
  http(
    meryl()
      .h('GET /', function(req, resp) { resp.send('test data'); })
      .cgi(),
    function (server, client) {
      async.series([
        function(ok) {
          client.fetch('GET', '/', {}, function (resp) {
              test.equal(200, resp.statusCode);
              test.equal('test data', resp.body);
              ok();
            }
          );
        },
        function(ok) {
          client.fetch('GET', '/absent', {}, function (resp) {
              test.equal(404, resp.statusCode);
              ok();
            }
          );
        },
        function (ok) {
          server.close();
          test.done();
          ok();
        }
      ]);
    }
  );
};

exports.testDefaultErrorHandler = function (test) {
  http(
    meryl()
      .h('GET /', function(req, resp) { throw 'error occured'; })
      .cgi(),
    function (server, client) {
      client.fetch('GET', '/', {}, function (resp) {
          test.equal(500, resp.statusCode);
          server.close();
          test.done();
        }
      );
    }
  );
};

