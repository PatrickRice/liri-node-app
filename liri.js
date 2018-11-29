// Declare variables, requirements, and the Spotify method for all LIRI functions
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var requestType = process.argv[2];
var requestValue = process.argv[3];
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


// "movie-this" section

if (requestType === "movie-this" && requestValue !== undefined) {
    var nodeArgs = process.argv;
    var movieName = "";

    // Loop to add a "+" between blank spaces in the movie name to accommodate multi-word input
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
        }
        else {
            movieName += nodeArgs[i];
        }
    }

    // Query the OMDb API to get info on the user-input movie
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
    function(response) {
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("IMDb Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country Produced: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
    }
    );

// If the user does not input movie data, info on the movie "Mr. Nobody" will be queried and returned
} else if (requestType === "movie-this" && requestValue === undefined) {
    var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
      function(response) {
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("IMDb Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country Produced: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
      }
    );
}


// "concert-this" section

if (requestType === "concert-this" && requestValue !== undefined) {
    var nodeArgs = process.argv;
    var artist = "";

    // Loop to add a "+" between blank spaces in the artist name to accommodate multi-word input
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            artist = artist + "+" + nodeArgs[i];
        }
        else {
            artist += nodeArgs[i];
        }
    }

    // Query the bands-in-town API to get info on the user-input band/artist
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(
    function(response) {
        console.log("Name of Venue: " + response.data[0].venue.name);
        console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
        console.log("Date of Event: " + moment(response.data[0].datetime, moment.ISO_8601).format("MM/DD/YYYY"));
    }
    );

// Instructs the user to enter data for a band/artist if none is entered initially
} else if (requestType === "concert-this" && requestValue === undefined) {
        console.log("Please enter the name of a band or artist (e.g. 'Rush' or 'George Clinton')");
}


// "spotify-this-song" section

if (requestType === "spotify-this-song" && requestValue !== undefined) {
    var nodeArgs = process.argv;
    var song = "";

    // Loop to add a "+" between blank spaces in the song name to accommodate multi-word input
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            song = song + "+" + nodeArgs[i];
        }
        else {
            song += nodeArgs[i];
        }
    }

    spotify.search({ type: 'track', query: song, limit: 1 })
    .then(function(response) {
        console.log("Artist(s): " + response.tracks.items[0].album.artists[0].name);
        console.log("Song Name: " + response.tracks.items[0].name);
        console.log("Preview Link: " + response.tracks.items[0].external_urls.spotify);
        console.log("Album this Song is from: " + response.tracks.items[0].album.name);
    })
    .catch(function(err) {
        console.log(err);
    });

} else if (requestType === "spotify-this-song" && requestValue === undefined) {
    spotify.search({ type: 'track', query: 'The Sign' })
    .then(function(response) {
        console.log("Artist(s): " + response.tracks.items[9].album.artists[0].name);
        console.log("Song Name: " + response.tracks.items[9].name);
        console.log("Preview Link: " + response.tracks.items[9].external_urls.spotify);
        console.log("Album this Song is from: " + response.tracks.items[9].album.name);
    })
}

// "do-what-it-says" portion
var action = ""
var searchCriteria = ""


if (requestType === "do-what-it-says") {

        // readFile method containing a function to read the text from 'random.txt' to determine the action and output the response data to the command line
        fs.readFile("random.txt", "utf8", function(error, data) {
          if (error) {
            return console.log(error);
          } else {

          // takes the data from 'random.txt' and stores it in an array
          var dataArr = data.split(",");

          // sets the 'action' variable as first index string in the 'dataArr' array
          action = dataArr[0];

          // sets the 'searchCriteria' variable as second index string in the 'dataArr' array
          searchCriteria = dataArr[1];

                // if and else if statements to determine the action being requested, query the appropriate API, and return the same data as when the request is sent via the CLI
                if (action === "spotify-this-song") {
                    spotify.search({ type: 'track', query: searchCriteria, limit: 1 })
                    .then(function(response) {
                        console.log("Artist(s): " + response.tracks.items[0].album.artists[0].name);
                        console.log("Song Name: " + response.tracks.items[0].name);
                        console.log("Preview Link: " + response.tracks.items[0].external_urls.spotify);
                        console.log("Album this Song is from: " + response.tracks.items[0].album.name);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
                } else if (action === "concert-this") {
                    var searchCriteria = searchCriteria.replace(/\s+/g, '+');
                    var queryUrl = "https://rest.bandsintown.com/artists/" + searchCriteria + "/events?app_id=codingbootcamp";

                    axios.get(queryUrl).then(
                    function(response) {
                        console.log("Name of Venue: " + response.data[0].venue.name);
                        console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
                        console.log("Date of Event: " + moment(response.data[0].datetime, moment.ISO_8601).format("MM/DD/YYYY"));
                    }
                    );
                } else if (action === "movie-this") {
                    var searchCriteria = searchCriteria.replace(/\s+/g, '+');
                    var queryUrl = "http://www.omdbapi.com/?t=" + searchCriteria + "&y=&plot=short&apikey=trilogy";

                    axios.get(queryUrl).then(
                    function(response) {
                        console.log("Title: " + response.data.Title);
                        console.log("Release Year: " + response.data.Year);
                        console.log("IMDb Rating: " + response.data.imdbRating);
                        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                        console.log("Country Produced: " + response.data.Country);
                        console.log("Language: " + response.data.Language);
                        console.log("Plot: " + response.data.Plot);
                        console.log("Actors: " + response.data.Actors);
                    }
                    );
                }
          }
        });
}
