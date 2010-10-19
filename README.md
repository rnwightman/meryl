Meryl
=====

Meryl is minimalist web framework for nodejs platform.
It is really simple to use, fun to play and easy to modify.

Here is simple preview.

	var meryl = require('meryl');
	
	meryl
	  .plug('GET *', function (req, resp, next) {
	      resp.headers.server = 'Meryl on NodeJS';
	      next();
	    }
	  )
	  .plug('GET /private/*', function (req, resp, next) {
	      resp.status = 401;
	      throw 'Forbidden';
	    }
	  )
	  .handle('GET /', function (req, resp) {
	      resp.send('<h3>Hello, World!</h3>');
	    }
	  )
	  .handle('GET /greet/{name}', function (req, resp) {
	      resp.send('<h3>Hello, ' + req.params.name + '</h3>');
	    }
	  )
	  .run();

Meryl has much more...

Please visit Meryl homepage for all related stuff.

<http://coffeemate.github.com/meryl>

For updates please follow: <http://twitter.com/meryljs>

Contributors:

 * Kadir Pekel (Author) <http://twitter.com/kadirpekel>
 * George Stagas <http://twitter.com/stagas>
 * Samuel Morello <http://twitter.com/ouvanous>
 * Tom R <http://twitter.com/rx>

