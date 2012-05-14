// Generated by CoffeeScript 1.3.1
(function() {
  var constants, http, nytkey, rtkey, toTitleCase, yelp_consumer_key, yelp_consumer_secret, yelp_oauth_token, yelp_token_secret;

  http = require('http');

  constants = require('../constants');

  rtkey = constants.rtkey;

  nytkey = constants.nytkey;

  yelp_consumer_key = constants.yelp_consumer_key;

  yelp_consumer_secret = constants.yelp_consumer_secret;

  yelp_oauth_token = constants.yelp_oauth_token;

  yelp_token_secret = constants.yelp_token_secret;

  exports.movies = function(req, res) {
    var movies, options;
    console.log("request for movies");
    res.writeHead(200);
    options = {
      host: 'api.rottentomatoes.com',
      port: '80',
      path: '/api/public/v1.0/lists/movies/box_office.json?apikey=' + rtkey,
      method: 'GET'
    };
    movies = "";
    try {
      return http.get(options, function(result) {
        result.setEncoding('utf8');
        result.on('data', function(chunk) {
          return movies += chunk;
        });
        return result.on('end', function() {
          var movie, movieject, _i, _len;
          console.log(movies);
          try {
            movieject = JSON.parse(movies)['movies'];
          } catch (e) {
            "Some shit went wrong parsing movies.";

            console.log(e);
          }
          for (_i = 0, _len = movieject.length; _i < _len; _i++) {
            movie = movieject[_i];
            if (movie.posters.detailed != null) {
              movie.imageurl = movie.posters.detailed;
            } else {
              console.log('where the fuck is the image');
            }
          }
          res.write(JSON.stringify(movieject));
          return res.end();
        });
      });
    } catch (e) {
      console.log("Some shit went wrong with a movie request.");
      return console.log(e);
    }
  };

  exports.books = function(req, res) {
    var books, options;
    console.log("request for books");
    res.writeHead(200);
    options = {
      host: 'api.nytimes.com',
      port: '80',
      path: '/svc/books/v2/lists/hardcover-fiction?api-key=' + nytkey,
      method: 'GET'
    };
    books = "";
    try {
      return http.get(options, function(result) {
        result.setEncoding('utf8');
        result.on('data', function(chunk) {
          return books += chunk;
        });
        return result.on('end', function() {
          var book, bookject, _i, _len;
          try {
            bookject = JSON.parse(books);
            bookject = (function() {
              var _i, _len, _ref, _results;
              _ref = bookject['results'];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                book = _ref[_i];
                _results.push(book['book_details'][0]);
              }
              return _results;
            })();
          } catch (e) {
            "Some shit went wrong parsing books.";

            console.log(e);
          }
          for (_i = 0, _len = bookject.length; _i < _len; _i++) {
            book = bookject[_i];
            if (book.title != null) {
              book.title = toTitleCase(book.title);
              book.imageurl = "http://afternoon-planet-7936.herokuapp.com/imageSearch?query=" + encodeURIComponent(book.title);
            } else {
              console.log('where the fuck is the title');
            }
          }
          res.write(JSON.stringify(bookject));
          return res.end();
        });
      });
    } catch (e) {
      console.log("Some shit went wrong with a book request.");
      return console.log(e);
    }
  };

  exports.restaurants = function(req, res) {
    var lat, lon, yelp;
    console.log("request for restaurants at lat, long: ");
    lat = req.query['lat'];
    lon = req.query['lon'];
    console.log(lat, lon);
    yelp = require("yelp").createClient({
      consumer_key: yelp_consumer_key,
      consumer_secret: yelp_consumer_secret,
      token: yelp_oauth_token,
      token_secret: yelp_token_secret
    });
    res.writeHead(200);
    return yelp.search({
      category_filter: "restaurants,bars",
      sort: 2,
      ll: "" + lat + "," + lon
    }, function(error, places) {
      var place, _i, _len;
      if (error != null) {
        console.log(error);
      }
      places = places.businesses;
      for (_i = 0, _len = places.length; _i < _len; _i++) {
        place = places[_i];
        place.title = place.name;
        place.description = place.snippet_text;
        place.url = place.mobile_url;
        place.imageurl = "http://afternoon-planet-7936.herokuapp.com/imageSearch?query=" + encodeURIComponent(place.name);
      }
      res.write(JSON.stringify(places));
      return res.end();
    });
  };

  exports.outings = function(req, res) {
    var lat, lon, yelp;
    console.log("request for outings at lat, long: ");
    lat = req.query['lat'];
    lon = req.query['lon'];
    console.log(lat, lon);
    yelp = require("yelp").createClient({
      consumer_key: yelp_consumer_key,
      consumer_secret: yelp_consumer_secret,
      token: yelp_oauth_token,
      token_secret: yelp_token_secret
    });
    res.writeHead(200);
    return yelp.search({
      category_filter: "localflavor",
      sort: 2,
      ll: "" + lat + "," + lon
    }, function(error, places) {
      var place, _i, _len;
      if (error != null) {
        console.log(error);
      }
      places = places.businesses;
      for (_i = 0, _len = places.length; _i < _len; _i++) {
        place = places[_i];
        place.title = place.name;
        place.url = place.mobile_url;
        place["description"] = place['snippet_text'];
        place.imageurl = "http://afternoon-planet-7936.herokuapp.com/imageSearch?query=" + encodeURIComponent(place.name);
      }
      res.write(JSON.stringify(places));
      return res.end();
    });
  };

  exports.imageSearch = function(req, res) {
    var images, options, search;
    search = encodeURIComponent(req.query['query']);
    options = {
      host: 'ajax.googleapis.com',
      port: '80',
      path: "/ajax/services/search/images?v=1.0&q=" + search,
      method: 'GET'
    };
    images = "";
    return http.get(options, function(result) {
      result.setEncoding('utf8');
      result.on('data', function(chunk) {
        return images += chunk;
      });
      return result.on('end', function() {
        var image, imageject, _i, _len;
        imageject = JSON.parse(images);
        imageject = imageject.responseData.results;
        for (_i = 0, _len = imageject.length; _i < _len; _i++) {
          image = imageject[_i];
          if (image.height > 400 && image.height < 900) {
            res.redirect(image.url);
            return;
          }
        }
        return res.redirect(imageject[0].url);
      });
    });
  };

  toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

}).call(this);
