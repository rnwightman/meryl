var meryl = require('../../index');
  
meryl.h('GET /', function (req, resp) {
  resp.send("<h1>Hello World!</h1>");
});

require('http').createServer(meryl.cgi()).listen(3000);
console.log('serving http://localhost:3000');
