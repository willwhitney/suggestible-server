(function() {
  var constants, http, nytkey, rtkey, toTitleCase;
  http = require('http');
  constants = require('../constants');
  rtkey = constants.rtkey;
  nytkey = constants.nytkey;
  exports.movies = function(req, res) {
    var movies, options;
    res.writeHead(200);
    options = {
      host: 'api.rottentomatoes.com',
      port: '80',
      path: '/api/public/v1.0/lists/movies/box_office.json?apikey=' + rtkey,
      method: 'GET'
    };
    movies = "";
    return http.get(options, function(result) {
      console.log('STATUS: ' + result.statusCode);
      console.log('HEADERS: ' + JSON.stringify(result.headers));
      result.setEncoding('utf8');
      result.on('data', function(chunk) {
        console.log("BODY: " + chunk);
        return movies += chunk;
      });
      return result.on('end', function() {
        var movieject;
        movieject = JSON.parse(movies)['movies'];
        res.write(JSON.stringify(movieject));
        console.log("END");
        return res.end();
      });
    });
  };
  exports.books = function(req, res) {
    var books, options;
    res.writeHead(200);
    options = {
      host: 'api.nytimes.com',
      port: '80',
      path: '/svc/books/v2/lists/hardcover-fiction?api-key=' + nytkey,
      method: 'GET'
    };
    books = "";
    return http.get(options, function(result) {
      console.log('STATUS: ' + result.statusCode);
      console.log('HEADERS: ' + JSON.stringify(result.headers));
      result.setEncoding('utf8');
      result.on('data', function(chunk) {
        console.log("BODY: " + chunk);
        return books += chunk;
      });
      return result.on('end', function() {
        var book, bookject;
        bookject = JSON.parse(books);
        return bookject = [
          (function() {
            var _i, _len, _ref, _results;
            _ref = bookject['results'];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              book = _ref[_i];
              _results.push(book['book_details'][0]);
            }
            return _results;
          })()
        ][0];
      });
    });
  };
  toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
}).call(this);
