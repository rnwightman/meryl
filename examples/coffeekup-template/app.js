var meryl = require('../../index'),
  coffeekup = require('coffeekup');

var opts = {
  templateDir: 'templates',
  templateExt: '.kup',
  templateFunc: coffeekup.adapters.meryl,
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

