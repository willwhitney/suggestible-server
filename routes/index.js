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
    return http.get(options, function(result) {
      result.setEncoding('utf8');
      result.on('data', function(chunk) {
        return movies += chunk;
      });
      return result.on('end', function() {
        var movie, movieject, _i, _len;
        movieject = JSON.parse(movies)['movies'];
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
    return http.get(options, function(result) {
      result.setEncoding('utf8');
      result.on('data', function(chunk) {
        return books += chunk;
      });
      return result.on('end', function() {
        var book, bookject, _i, _len;
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
        for (_i = 0, _len = bookject.length; _i < _len; _i++) {
          book = bookject[_i];
          if (book.title != null) {
            book.title = toTitleCase(book.title);
          } else {
            console.log('where the fuck is the title');
          }
        }
        res.write(JSON.stringify(bookject));
        return res.end();
      });
    });
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
        place.description = place.snippet_text;
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
        place["description"] = place['snippet_text'];
      }
      res.write(JSON.stringify(places));
      return res.end();
    });
  };

  toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

}).call(this);
