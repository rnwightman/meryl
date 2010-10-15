var meryl = require('../../index'),
  coffeekup = require('coffeekup');

var opts = {
  templateDir: 'templates',
  templateExt: '.kup',
  templateFunc: function (src, data) {
    return coffeekup.render(src, {context: data});
  },
  debug: true
};

meryl
  .h('GET /', function(req, resp) {
      resp.render('layout',
        {content: 'home', context: {people: ['bob', 'alice', 'jane', 'meryl']}});
    }
  )
  .run(opts);

console.log('listening...');

