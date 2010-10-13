var meryl = require('../../index'),
  merylex = require('meryl-extras'),
  qs = require('querystring');
  staticfile = merylex('staticfile'),
  generictemplate = merylex('generictemplate');

var twinkles =  ['This is my freaking first wink', 'Hey tweeting sucks, lets twinkle'];

meryl.p(generictemplate());

meryl.p(function(req, resp, next) {
  resp.redirect = function(loc) {
    resp.status = 301;
    resp.headers['Location'] = loc;
    resp.send();
  };
  next();
});

meryl.p('GET /static/<filepath>', staticfile());

meryl.h('GET /', function(req, resp) {
  resp.render('index', {twinkles: twinkles});
});

meryl.h('POST /newtweet', function(req, resp) {
  var postdataAsObject = qs.parse(req.postdata.toString());
  if(postdataAsObject && postdataAsObject.wink) {
    twinkles.push(postdataAsObject.wink);
  }
  resp.redirect('/');
});

require('http').createServer(meryl.cgi()).listen(3000);

