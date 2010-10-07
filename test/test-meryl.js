var util = require('./fixtures/fixture-util');
var meryl = require('./../index').newInstance;


exports.testTest = function (test) {
  util.serve(
    meryl()
      .h('GET /', function(req, resp) {
        resp.send('test data');
      })
      .cgi(),
    function (server) {
      util.fetch('GET', '/', {}, function (resp) {
          test.equal(200, resp.statusCode);
          test.equal('test data', resp.body);
          server.close();
          test.done();
        }
      );
    }
  );
};
