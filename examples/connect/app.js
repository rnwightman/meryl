var Connect = require('connect');
var meryl = require('meryl');

meryl.h('GET /', function() {
  this.send('Connected :)');
});

var server = Connect.createServer(
  Connect.logger(),
  meryl.cgi()
);

server.listen(3000);

