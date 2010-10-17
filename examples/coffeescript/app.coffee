(require '../../index')

  .get '/', (req, resp) ->
    resp.send 'Hello World'
    
  .get '/foo', (req, resp) ->
    resp.send 'Bar'

  .run()
