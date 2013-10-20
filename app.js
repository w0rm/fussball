var connect = require('connect')
  , fussball = require('lib/fussball')

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.query())
  .use(function(req, res, next){
    var options = {
      width: req.query.width || 290
    , height: req.query.height || 150
    , scale: req.query.scale || 2
    }
    res.writeHead(200, {'Content-Type': 'image/png'})
    fussball(options).encode(function (data, error) {
      res.write(data)
      res.end()
    })
  })
 .listen(process.env.PORT || 8888)
