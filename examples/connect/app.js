var Connect = require('connect'),
  meryl = require('../../index');

meryl.plug(Connect.staticProvider());

meryl.plug('GET *', Connect.logger());

meryl.h('GET /', function(req, resp) {
  resp.send('Connected :)');
});

require('http').createServer(meryl.cgi()).listen(3000);
console.log('serving http://localhost:3000');
