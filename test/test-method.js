var meryl = require('./../index').factory,
  http = require('./fixtures/httputil');

['GET', 'POST', 'PUT', 'DELETE'].forEach(function (val) {
  exports['test' + val + 'method'] = function (test) {
    http(
      meryl()
        .h(val + ' /', function(req, resp) {
          resp.send(req.method);
        })
        .cgi(),
      function (server, client) {
        client.fetch(val, '/', {}, function (resp) {
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
