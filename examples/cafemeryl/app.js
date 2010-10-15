var meryl = require('../../index');

meryl.render = function(name, data) {

}

meryl
  .h('GET /', function(req, resp) {
      resp.render('home', {content: 'main', locals: {foo: 'bar'}});
    }
  )
  .run();
