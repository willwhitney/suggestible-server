(function() {
  var constants, getMovies, http, rtkey;
  http = require('http');
  constants = require('../constants');
  rtkey = constants.rtkey;
  exports.index = function(req, res) {
    var movies;
    res.writeHead(200);
    movies = getMovies();
    res.write(movies);
    return res.end("balls, mate!");
  };
  getMovies = function() {
    var movies, options, req;
    options = {
      host: 'api.rottentomatoes.com',
      port: '80',
      path: '/api/public/v1.0/lists/movies/box_office.json?apikey=' + rtkey,
      method: 'GET'
    };
    movies = "test";
    req = http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      return res.on('data', function(chunk) {
        return console.log('BODY: ' + chunk);
      });
    });
    req.end();
    console.log(movies);
    return movies;
  };
}).call(this);
