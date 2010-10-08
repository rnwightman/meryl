var meryl = require('./../index').factory,
  util = require('./fixtures/fixture-util');

['GET', 'POST', 'PUT', 'DELETE'].forEach(function (val) {
  exports['test' + val + 'method'] = function (test) {
    util.serve(
      meryl()
        .h(val + ' /', function(req, resp) {
          resp.send(req.method);
        })
        .cgi(),
      function (server) {
        util.fetch(val, '/', {}, function (resp) {
            test.equal(200, resp.statusCode);
            test.equal(val, resp.body);
            server.close();
            test.done();
          }
        );
      }
    );
  };
});