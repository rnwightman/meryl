var Connect = require('connect');
var meryl = require('../../index');

meryl.h('GET /', function(req, resp) {
  resp.send('Connected :)');
});

var server = Connect.createServer(
  Connect.logger(),
  meryl.cgi()
);

server.listen(3000);
console.log('serving http://localhost:3000');
