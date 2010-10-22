var Connect = require('connect'),
  meryl = require('../../index');

meryl
  .p(
    function (req, resp, next) {
      resp.headers.server = 'nodejs/connect/meryl';
      next();
    },
    Connect.logger()
  )  
  .p('GET *',
    Connect.favicon(),
    Connect.staticProvider()
  )
  .h('GET /', function (req, resp) {
    resp.send("<h1>Welcome To NodeJS!</h1><img src='nodejs.png' />");
  })
  .run();

console.log('listening...');
