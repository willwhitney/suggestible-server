http = require('http')
constants = require '../constants'
rtkey = constants.rtkey
nytkey = constants.nytkey
yelp_consumer_key = constants.yelp_consumer_key
yelp_consumer_secret = constants.yelp_consumer_secret
yelp_oauth_token = constants.yelp_oauth_token
yelp_token_secret = constants.yelp_token_secret

exports.movies = (req, res) -> 
  
  res.writeHead(200)
   
  options = {
    host: 'api.rottentomatoes.com',
    port: '80',
    path: '/api/public/v1.0/lists/movies/box_office.json?apikey=' + rtkey,
    method: 'GET'
  }
    
  
  movies = ""
    
  http.get(options, (result) ->
    
    console.log 'STATUS: ' + result.statusCode
    console.log 'HEADERS: ' + JSON.stringify(result.headers)
    result.setEncoding 'utf8'
    result.on('data', (chunk) ->
      console.log "BODY: " + chunk
      movies += chunk
      
    )
    result.on('end', () ->
      # res.write("\nEND OF FILE")
      movieject = JSON.parse(movies)['movies']
      res.write JSON.stringify movieject
      console.log("END");
      res.end()
    )
    
  )

exports.books = (req, res) -> 

  res.writeHead(200)
   
  options = {
    host: 'api.nytimes.com',
    port: '80',
    path: '/svc/books/v2/lists/hardcover-fiction?api-key=' + nytkey,
    method: 'GET'
  }
  
  books = ""
    
  http.get(options, (result) ->
    
    console.log 'STATUS: ' + result.statusCode
    console.log 'HEADERS: ' + JSON.stringify(result.headers)
    result.setEncoding 'utf8'
    result.on('data', (chunk) ->
      # console.log("BODY: " + chunk)
      books += chunk
    )
    result.on('end', () ->
      bookject = JSON.parse books
      bookject = (book['book_details'][0] for book in bookject['results'])

      for book in bookject
        if book.title?
          book.title = toTitleCase(book.title)
        else
          console.log 'where the fuck is the title'

      console.log(bookject)

      res.write JSON.stringify bookject
      console.log "END"
      res.end()
        
    )
    
  )
  
exports.restaurants = (req, res) -> 

  yelp = require("yelp").createClient({
    consumer_key: yelp_consumer_key, 
    consumer_secret: yelp_consumer_secret,
    token: yelp_oauth_token,
    token_secret: yelp_token_secret
  })

  lat = req.query['lat']
  lon = req.query['lon']
  console.log lat, lon

  res.writeHead(200)
       
  
  yelp.search({term: "restaurants", ll: "#{lat},#{lon}"}, (error, places) ->
    if error?
      console.log error
    
    console.log places
    places = places.businesses
    res.write JSON.stringify places
    
    res.end()
  )
  
  ###  
  http.get(options, (result) ->
    
    console.log 'STATUS: ' + result.statusCode
    console.log 'HEADERS: ' + JSON.stringify(result.headers)
    result.setEncoding 'utf8'
    result.on('data', (chunk) ->
      console.log("BODY: " + chunk)
      places += chunk
    )
    result.on('end', () ->
      placeject = JSON.parse places
  
  
      res.write JSON.stringify placeject
      console.log "END"
      res.end()
        
    )
    
  )
  ###

  
  
toTitleCase = (str) ->
  return str.replace(/\w\S*/g, (txt) -> 
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())

    























