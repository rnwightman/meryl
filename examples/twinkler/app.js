var meryl = require('../../index'),
  Connect = require('connect'),
  qs = require('querystring');

var twinkles =  ['This is my freaking first wink', 'Hey tweeting sucks, lets twinkle'];

meryl.p(Connect.staticProvider({root: 'public'}));

meryl.p(function(req, resp, next) {
  resp.redirect = function(loc) {
    resp.status = 301;
    resp.headers['Location'] = loc;
    resp.send();
  };
  next();
});

meryl.h('GET /', function(req, resp) {
  resp.render('index', {twinkles: twinkles});
});

meryl.h('POST /newwink', function(req, resp) {
  var postdataAsObject = qs.parse(req.postdata.toString());
  if(postdataAsObject && postdataAsObject.wink) {
    twinkles.push(postdataAsObject.wink);
  }
  resp.redirect('/');
});

meryl.run({templateDir:'views'});

console.log('listening...');

