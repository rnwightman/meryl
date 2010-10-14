var meryl = require('../../index');
  
meryl
  .h('GET /', function (req, resp) { resp.send("<h1>Hello World!</h1>"); })
  .run();

console.log('serving http://localhost:3000');
