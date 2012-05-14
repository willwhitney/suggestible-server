http = require('http')
constants = require '../constants'
rtkey = constants.rtkey
nytkey = constants.nytkey
yelp_consumer_key = constants.yelp_consumer_key
yelp_consumer_secret = constants.yelp_consumer_secret
yelp_oauth_token = constants.yelp_oauth_token
yelp_token_secret = constants.yelp_token_secret


process.on('uncaughtException', (err) ->
  console.error(err)
  console.log("Node NOT Exiting...")
)

exports.movies = (req, res) -> 
  
  console.log "request for movies"
  
  res.writeHead(200)
   
  options = {
    host: 'api.rottentomatoes.com',
    port: '80',
    path: '/api/public/v1.0/lists/movies/box_office.json?limit=20&country=us&apikey=' + rtkey,
    method: 'GET'
  }
    
  
  movies = ""
  try
    http.get(options, (result) ->
      
      console.log 'STATUS: ' + result.statusCode
      console.log 'HEADERS: ' + JSON.stringify(result.headers)
      result.setEncoding 'utf8'
      result.on('data', (chunk) ->
        # console.log "BODY: " + chunk
        movies += chunk
        
      )
      result.on('end', () ->
        # console.log movies
        try
          movieject = JSON.parse(movies)['movies']
        catch e
          "Some shit went wrong parsing movies."
          # console.log e
          
        if !movieject?
          console.log "movieject doesn't exist, for some reason."
          console.log "this is what RT gave me: "
          console.log movies
          
        for movie in movieject
          if movie.posters.detailed?
            movie.imageurl = movie.posters.detailed
          else
            console.log 'where the fuck is the image'
  
        # console.log movieject
        res.write JSON.stringify movieject
        # console.log("END");
        res.end()
      )
      
    )
  catch e
    console.log "Some shit went wrong with a movie request."
    # console.log e

exports.books = (req, res) -> 

  console.log "request for books"

  res.writeHead(200)
   
  options = {
    host: 'api.nytimes.com',
    port: '80',
    path: '/svc/books/v2/lists/hardcover-fiction?api-key=' + nytkey,
    method: 'GET'
  }
  
  books = ""
  
  try
    http.get(options, (result) ->
      
      # console.log 'STATUS: ' + result.statusCode
      # console.log 'HEADERS: ' + JSON.stringify(result.headers)
      result.setEncoding 'utf8'
      result.on('data', (chunk) ->
        # console.log("BODY: " + chunk)
        books += chunk
      )
      result.on('end', () ->
        try
          bookject = JSON.parse books
          bookject = (book['book_details'][0] for book in bookject['results'])
        catch e
          "Some shit went wrong parsing books."
          console.log e

        for book in bookject
          if book.title?
            book.title = toTitleCase(book.title)
            book.imageurl = "http://afternoon-planet-7936.herokuapp.com/imageSearch?query=" + encodeURIComponent(book.title)
          else
            console.log 'where the fuck is the title'
  
        # console.log(bookject)
  
        res.write JSON.stringify bookject
        # console.log "END"
        res.end()
          
      )
    )
  catch e
    console.log "Some shit went wrong with a book request."
    console.log e
  
exports.restaurants = (req, res) -> 

  console.log "request for restaurants at lat, long: "
  lat = req.query['lat']
  lon = req.query['lon']
  console.log lat, lon


  yelp = require("yelp").createClient({
    consumer_key: yelp_consumer_key, 
    consumer_secret: yelp_consumer_secret,
    token: yelp_oauth_token,
    token_secret: yelp_token_secret
  })

  res.writeHead(200)
       
  
  yelp.search({category_filter: "restaurants,bars", sort:2, ll: "#{lat},#{lon}"}, (error, places) ->
    if error?
      console.log error
    
    places = places.businesses
    
    for place in places
      place.title = place.name
      place.description = place.snippet_text
      place.url = place.mobile_url
      place.imageurl = "http://afternoon-planet-7936.herokuapp.com/imageSearch?query=" + encodeURIComponent(place.name)
      place.maplocation = place.location.display_address[0] + place.location.display_address[1]

    # console.log places
    res.write JSON.stringify places
    
    res.end()
  )
  
  

exports.outings = (req, res) -> 

  console.log "request for outings at lat, long: "
  lat = req.query['lat']
  lon = req.query['lon']
  console.log lat, lon


  yelp = require("yelp").createClient({
    consumer_key: yelp_consumer_key, 
    consumer_secret: yelp_consumer_secret,
    token: yelp_oauth_token,
    token_secret: yelp_token_secret
  })
    
  res.writeHead(200)
       
  
  yelp.search({category_filter: "localflavor", sort:2, ll: "#{lat},#{lon}"}, (error, places) ->
    if error?
      console.log error
    

    places = places.businesses
    
    for place in places
      place.title = place.name
      place.url = place.mobile_url
      place["description"] = place['snippet_text']
      place.imageurl = "http://afternoon-planet-7936.herokuapp.com/imageSearch?query=" + encodeURIComponent(place.name)
      place.maplocation = place.location.display_address[0] + ", " + place.location.display_address[1]

    # console.log places    
    res.write JSON.stringify places
    
    res.end()
  )
  
  
exports.imageSearch = (req, res) ->

  search = encodeURIComponent(req.query['query'])

  options = {
    host: 'ajax.googleapis.com',
    port: '80',
    path: "/ajax/services/search/images?v=1.0&q=#{search}",
    method: 'GET'
  }
  
  images = ""
    
  http.get(options, (result) ->
    
    # console.log 'STATUS: ' + result.statusCode
    # console.log 'HEADERS: ' + JSON.stringify(result.headers)
    result.setEncoding 'utf8'
    result.on('data', (chunk) ->
      # console.log("BODY: " + chunk)
      images += chunk
    )
    result.on('end', () ->
      imageject = JSON.parse images
      imageject = imageject.responseData.results
  
      # console.log(imageject)
  
      # console.log "END"
      for image in imageject
        if image.height > 400 and image.height < 900
          res.redirect(image.url)
          return
      res.redirect(imageject[0].url)
    )
  )
  
toTitleCase = (str) ->
  return str.replace(/\w\S*/g, (txt) -> 
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())

    























