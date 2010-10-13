var http = require('http');

module.exports = function (cgi, envReady) {
  var hostname = process.env.HOSTNAME || 'localhost';
  var port = process.env.PORT || 3000;
	
  var server = http.createServer(cgi);
  server.listen(port, hostname);
  
  var client = http.createClient(port, hostname);
  client.fetch = function (method, path, headers, respReady) {
    var request = this.request(method, path, headers);
    request.end();
    request.on('response', function (response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        if (response.body)
          response.body += chunk;
        else 
          response.body = chunk;
      });
      response.on('end', function () {
        try {
          response.bodyAsObject = JSON.parse(response.body);
        } catch (e) { }
        respReady(response);
      });
    });
  };

  process.nextTick(function () {
	  if (envReady && typeof envReady == 'function')
	  	envReady(server, client);
  });
};

