/*
 * This example also uses 'meryl-extras' module
 * which contains useful add-on contributions
 * to make Meryl ready for production requirements
 */

var meryl = require('../../index'),
  merylex = require('meryl-extras'),
  qs = require('querystring');
 
var staticfile = merylex('staticfile');
var microtemplate = merylex('microtemplate');

var twinkles =  ['This is my freaking first wink', 'Hey tweeting sucks, lets twinkle'];

// Extend Meryl context with useful helper functions
meryl.x('render', microtemplate());

meryl.x('redirect', function(loc) {
  this.status = 301;
  this.headers['Location'] = loc;
  this.send();
});

meryl.x('decodeSimplePostData', function(postdata) {
  if(typeof postdata != 'string')
    return qs.parse(postdata.toString());
  return qs.parse(postdata);
});

// Register our ready to static file plugin to work under 'static' virtual path
meryl.p('GET /static/<filepath>', staticfile());

// Also register out handlers
meryl.h('GET /', function() {
  this.render('index', {twinkles: twinkles});
});

meryl.h('POST /newtweet', function() {
  var data = this.decodeSimplePostData(this.postdata);
  if(data.wink) {
    twinkles.push(data.wink);
   }
  this.redirect('/');
});

// Plug Meryl into our http server
require('http').createServer(meryl.cgi()).listen(3000);
console.log('serving http://localhost:3000');
