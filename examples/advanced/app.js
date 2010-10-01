var meryl = require('./../../index');

/**
 * This example shows some advanced use of Meryl.
 * Please note that chaining of Meryl functions
 * and their verbose names instead of single letter ones.
 */

require('http').createServer(
  meryl
  
    .plug(function(req, resp) {
      resp.filteredSend = function (buffer) {
        resp.send("<h1>" + buffer.toString() + "</h1>")
      };
    })
    
    .filter('{method} <path>', function (req, resp, next) {
      resp.headers['Server'] = 'node';
      console.log(req.params.method + ' ' + req.params.path);
      next();
    })
    
    .filter('POST *', function (req, resp, next) {
      resp.status = 405;
      throw new Error('method not allowed');
    })
    
    .filter('{method} /private/*', function (req, resp, next) {
      resp.status = 401;
      throw new Error('access denied');
    })
    
    .handler('GET /', function (req, resp) {
      resp.send("<h1>Demonstraing Meryl</h1>");
    })
    
    .handler('GET /{pagename}.html', function (req, resp) {
      resp.filteredSend("You're reading: " + req.params.pagename);
    })
    
    .handler('GET /exception', function () {
      resp.send(1);
    })
    
    .cgi({prod: false})
    
).listen(3000);

console.log('serving http://localhost:3000');
