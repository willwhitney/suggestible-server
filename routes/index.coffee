http = require('http')
constants = require '../constants'
rtkey = constants.rtkey

exports.index = (req, res) -> 
  
  
  res.writeHead(200)
  movies = getMovies()
  res.write(movies)
  res.end( "balls, mate!" )
  # res.render('index', { title: getMovies() })



getMovies = () ->
  
  options = {
    host: 'api.rottentomatoes.com',
    port: '80',
    path: '/api/public/v1.0/lists/movies/box_office.json?apikey=' + rtkey,
    method: 'GET'
  }
  
  # console.log( options.host + options.path)
  
  movies = "test"
  
  req = http.request(options, (res) ->
    console.log('STATUS: ' + res.statusCode)
    console.log('HEADERS: ' + JSON.stringify(res.headers))
    res.setEncoding('utf8')
    res.on('data', (chunk) ->
      console.log('BODY: ' + chunk)
      # movies = movies + 'FUCK YOU' + chunk
    )
  )
  
  req.end()
  
  console.log(movies)
  
  return movies
  
