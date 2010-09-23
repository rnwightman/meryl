Meryl
=====

Meryl is minimalistic web framework for nodejs platform.
It is really simple to use, fun to play and easy to modify.

	// import meryl
	var meryl = require('meryl');
	
	// Now define a request handler tied to an url expression.
	meryl.h('GET /', function () { this.send('<h3>Hello, World!</h3>'); });
	
	// OK, here we go. Let's plug meryl into your http server instance.
	require('http').createServer(meryl.cgi()).listen(3000);

Meryl has much more...

Please visit Meryl homepage for all related stuff.

<http://coffeemate.github.com/meryl>

Also don't forget to check out Meryl Extras project which provides extra plugins
and extensions to decorate Meryl as you wish.

<http://github.com/coffeemate/meryl-extras>

For updates please follow: <http://twitter.com/kadirpekel>
