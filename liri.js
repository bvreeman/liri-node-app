require('dotenv').config();

const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require('request');
const fs = require('fs');

const spotify = new Spotify(keys.spotify);
const twitter = new Twitter(keys.twitter);

const action = process.argv[2];
let value = process.argv[3];
const actionPlusValue = `Query: ${action}, '${value}' \r\n`;

// running a switch so the program knows which function to call
// based on the second argument input by the user

switch (action) {
  case 'my-tweets':
    myTweets();
    break;

  case 'spotify-this-song':
    spotifyThisSong();
    break;

  case 'movie-this':
    movieThis();
    break;

  case 'do-what-it-says':
    doWhatItSays();
    break;
}

// Append to log.txt file
function appendMyInfo() {
  if (process.argv[3] === undefined) {
    fs.appendFile('log.txt', `Query: ${action} \r\n`, function (err) {
      if (err) throw err;
    });
  } else {
    fs.appendFile('log.txt', actionPlusValue, function (err) {
      if (err) throw err;
    });
  }
}

// Retrieve Tweets from my Twitter Account

function myTweets() {
  twitter.get('statuses/user_timeline', function(error, tweets) {
    if (error) throw error;

    // Ran a loop in order to get the last 20 Tweets
    for (i = 0; i < 20; i++) {
      // Shows me the text from the last 20 Tweets
      console.log(tweets[i].text);

      // Shows me when the last 20 Tweets were created
      console.log(tweets[i].created_at);
      appendMyInfo();
    }
  });
}

function logMyErrors(err) {
  console.log(`This caused an error ${err}`);
}

// Retrieve song info from Spotify
function spotifyThisSong() {
  if (value === undefined) {
    value = 'Good Riddance';
  }
  spotify
    .search({ type: 'track', query: value })
    .then(function (response) {
      // console.log(value);

      if (response.tracks.items.length === 0) {
        console.log('The name you entered is not a valid title. Please try again');
      } else {
        console.log(`Artist: ${response.tracks.items[0].artists[0].name}`);
        console.log(`Song: ${response.tracks.items[0].name}`);
        console.log(`Preview URL: ${response.tracks.items[0].preview_url}`);
        console.log(`Album: ${response.tracks.items[0].album.name}`);
        appendMyInfo();
      }
    });
}

// a set of console logs to be run in the movieThis function

function getMovieInfo() {
  request(`http://www.omdbapi.com/?t=${value}&y=&plot=short&apikey=trilogy`, function(error, response, body) {
    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    // If the request is successful (i.e. if the response status code is 200)
    console.log(JSON.parse(body).Title);
    if (JSON.parse(body).Title === undefined) {
      console.log('The name you entered is not a valid title. Please try again');
    } else if (JSON.parse(body).Title !== undefined) {
      console.log(`Title: ${JSON.parse(body).Title}`);
      console.log(`Release Date: ${JSON.parse(body).Year}`);
      console.log(`Rating: ${JSON.parse(body).Rated}`);
      console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`);
      console.log(`Country: ${JSON.parse(body).Country}`);
      console.log(`Language: ${JSON.parse(body).Language}`);
      console.log(`Plot: ${JSON.parse(body).Plot}`);
      console.log(`Actors: ${JSON.parse(body).Rated}`);
      appendMyInfo();
    }
  });
}

function movieThis() {
  if (value != undefined) {
    value = value.replace(/ /g, '+');
    getMovieInfo();
  } else {
    value = 'Mr.+Nobody';
    getMovieInfo();
  }
}


function doWhatItSays() {
  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    const dataArray = data.split(',');
    if (dataArray[0] === 'my-tweet') {
      myTweets(dataArray[1]);
    }
    if (dataArray[0] === 'spotify-this-song') {
      spotifyThisSong(dataArray[1]);
    }
    if (dataArray[0] === 'movie-this') {
      // console.log(dataArray[1]);
      getMovieInfo(dataArray[1]);
    }
  });
}
