require("dotenv").config();
var moment = require("moment");
var Spotify = require("node-spotify-api");

var keys = require("./keys");

function main() {
  var command = process.argv[2];
  var searchTerm = process.argv[3];
  runCommands(command, searchTerm);
}

function runCommands(command, searchTerm) {
  switch (command) {
    case "spotify-this-song":
      RetrieveSong(searchTerm);
      break;
    case "concert-this":
      RetrieveBand(searchTerm);
      break;
    case "movie-this":
      RetrieveMovie(searchTerm);
      break;
    case "do-what-it-says":
      DoRandom(searchTerm);
      break;
    default:
      DoRandom();
  }
}

// spotify;
function RetrieveSong(songTitle) {
  var spotify = new Spotify(keys.spotify);
  console.log(songTitle);
  spotify.search({ type: "track", query: songTitle, limit: 2 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    var data = data.tracks.items;
    const filterObject = [
      "album",
      "name",
      "artists",
      "external_urls",
      "spotify"
    ];

    data = data.map(function(o) {
      return JSON.parse(JSON.stringify(o, filterObject));
    });
    console.log(data);
    for (var i in data) {
      return console.log(data[i].album.artists);
    }
  });
}

var request = require("request");
//omdb
function RetrieveMovie(movieTitle) {
  var url;
  if (movieTitle) {
    url =
      "http://www.omdbapi.com/?apikey=" +
      keys.omdb.omdbKeys +
      "&t=" +
      movieTitle;
  } else {
    url =
      "http://www.omdbapi.com/?apikey=" + keys.omdb.omdbKeys + "&i=tt0485947";
  }
  request(url, function(error, response, body) {
    // console.log(body);
    if (!error && response.statusCode === 200) {
      var searchArray = JSON.parse(body);

      var out = {};

      for (var i = 0; i < searchArray.Ratings.length; i++) {
        if (searchArray.Ratings[i].Source === "Rotten Tomatoes") {
          out["rottenTomatoes"] = searchArray.Ratings[i].Value;
        }
      }
      out["Title"] = searchArray.Title;
      out["Year"] = searchArray.Year;
      out["Actors"] = searchArray.Actors;
      out["imdbRating"] = searchArray.imdbRating;
      out["Plot"] = searchArray.Plot;
      out["Language"] = searchArray.Language;
      out["Country"] = searchArray.Country;

      console.log(out);
      return out;
    }
  });
}

//band in town

function RetrieveBand(bandName) {
  request(
    "https://rest.bandsintown.com/artists/" +
      bandName +
      "/events?app_id=codingbootcamp",
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        moment().format("ddd, hA");
        var result = JSON.parse(body);
        result = result.map(function(r) {
          var out = {};
          out["venue"] = r.venue;
          out["datetime"] = moment(r.datetime).format("MM/DD/YYYY");
          return out;
        });
        console.log(result);
      }
    }
  );

  console.log(bandName);
}

function DoRandom() {
  console.log("what time is it?");
  var fs = require("fs");
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    data = data.split(",");

    console.log(data);
    runCommands(data[0], data[1]);
  });
}
main();
