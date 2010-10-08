var meryl = require('./../index').factory,
  util = require('./fixtures/fixture-util');

exports.testSinglePathVar = function (test) {
  util.serve(
    meryl()
      .h('GET /{param1}', function(req, resp) {
        resp.send(JSON.stringify(req.params));
      })
      .cgi(),
    function (server) {
      util.fetch('GET', '/test1', {}, function (resp) {
          test.equal(200, resp.statusCode);
          test.equal('test1', resp.bodyAsObject.param1);
          server.close();
          test.done();
        }
      );
    }
  );
};

exports.testSingleGreedyPathVar = function (test) {
  util.serve(
    meryl()
      .h('GET /<param1>', function(req, resp) {
        resp.send(JSON.stringify(req.params));
      })
      .cgi(),
    function (server) {
      util.fetch('GET', '/test1/test2/test3', {}, function (resp) {
          test.equal(200, resp.statusCode);
          test.equal('test1/test2/test3', resp.bodyAsObject.param1);
          server.close();
          test.done();
        }
      );
    }
  );
};

exports.testMultiplePathVars = function (test) {
  util.serve(
    meryl()
      .h('GET /{param1}/{param2}/{param3}', function(req, resp) {
        resp.send(JSON.stringify(req.params));
      })
      .cgi(),
    function (server) {
      util.fetch('GET', '/test1/test2/test3', {}, function (resp) {
          test.equal(200, resp.statusCode);
          test.equal('test1', resp.bodyAsObject.param1);
          test.equal('test2', resp.bodyAsObject.param2);
          test.equal('test3', resp.bodyAsObject.param3);
          server.close();
          test.done();
        }
      );
    }
  );
};

exports.testMultipleGreedyPathVars = function (test) {
  util.serve(
    meryl()
      .h('GET /<param1>/<param2>', function(req, resp) {
        resp.send(JSON.stringify(req.params));
      })
      .cgi(),
    function (server) {
      util.fetch('GET', '/test1/test2/test3', {}, function (resp) {
          test.equal(200, resp.statusCode);
          test.equal('test1/test2', resp.bodyAsObject.param1);
          test.equal('test3', resp.bodyAsObject.param2);
          server.close();
          test.done();
        }
      );
    }
  );
};

exports.testMixedTypesOfPathVars = function (test) {
  util.serve(
    meryl()
      .h('GET /{param1}/<param2>/{param3}', function(req, resp) {
        resp.send(JSON.stringify(req.params));
      })
      .cgi(),
    function (server) {
      util.fetch('GET', '/test1/test2/test3/test4/test5', {}, function (resp) {
          test.equal(200, resp.statusCode);
          test.equal('test1', resp.bodyAsObject.param1);
          test.equal('test2/test3/test4', resp.bodyAsObject.param2);
          test.equal('test5', resp.bodyAsObject.param3);
          server.close();
          test.done();
        }
      );
    }
  );
};