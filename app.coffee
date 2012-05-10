express = require('express')
routes = require('./routes')

app = module.exports = express.createServer()

# Configuration

app.configure( () -> 
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(__dirname + '/public'))
)

app.configure('development', () -> 
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
)

app.configure('production', () -> 
  app.use(express.errorHandler())
)

# Routes

app.get('/movies', routes.movies)

app.get('/books', routes.books)

app.get('/restaurants', routes.restaurants)

app.get('/outings', routes.outings)


port = process.env.PORT || 3000
app.listen(port)
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)