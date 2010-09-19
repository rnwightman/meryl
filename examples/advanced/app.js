var meryl = require('./../../index');

/**
 * This example shows some advanced use of Meryl.
 * Please note that chaining of Meryl functions
 * and their verbose names instead of single letter ones.
 */

require('http').createServer(
  meryl
  
    .extend('htmlH1', function(text) {
      return "<h1>" + text + "</h1>";
    })
    
    .plugin('{method} <path>', function (chain) {
      this.headers['Server'] = 'node';
      console.log(this.params.method + ' ' + this.params.path);
      chain();
    })
    
    .plugin('POST *', function () {
      this.status = 405;
      throw new Error('method not allowed');
    })
    
    .plugin('{method} /private/*', function () {
      this.status = 401;
      throw new Error('access denied');
    })
    
    .handler('GET /', function () {
      this.send("<h1>Demonstraing Meryl</h1>");
    })
    
    .handler('GET /{pagename}\.html', function () {
      this.send(
        this.htmlH1("You're reading: " + this.params.pagename)
      );
    })
    
    .handler('GET /exception', function () {
      this.send(1);
    })
    
    .cgi({prod: false})
    
).listen(3000);

console.log('serving http://localhost:3000');