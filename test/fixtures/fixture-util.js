var http = require('http');

var hostname = process.env.HOSTNAME || 'localhost';
var port = process.env.PORT || 3000;

exports.fetch = function (method, path, headers, respReady) {
  var client = http.createClient(3000, 'localhost');
  var request = client.request(method, path, headers);
  request.end();
  request.on('response', function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      if (response.body)
        response.body += chunk.toString();
      else 
        response.body = chunk.toString();
    });
    response.on('end', function () {
      respReady(response);
    });
  });
};

exports.serve = function (cgi, envReady) {
  var server = http.createServer(cgi);
  server.listen(3000);
  process.nextTick(function () {
    envReady(server);
  });
};

