with (meryl) {

  get('/', function(req, resp) {
    resp.redirect('/posts');
  });
  
  get('/about', function(req, resp) {
    resp.send('<h3>Meryl is simple to use, fun to play, easy to modify!</h3>');
  });
}

