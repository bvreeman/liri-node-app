require('dotenv').config();

const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require('request');

// console.log(keys);

const spotify = new Spotify(keys.spotify);
const twitter = new Twitter(keys.twitter);

// console.log(spotify);
// console.log(twitter);

// twitter.get('search/tweets', { q: 'Brandon' }, function(error, tweets, response) {
//   console.log(tweets);
// });

const action = process.argv[2];
let value = process.argv[3];

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
    }
  });
}

// Retrieve song info from Spotify
function spotifyThisSong() {
  if (value == null) {
    value = 'Good Riddance';
  }
  spotify
    .search({ type: 'track', query: value })
    .then(function (response) {
      console.log(response.tracks.items[0].artists[0].name);
      console.log(response.tracks.items[0].name);
      console.log(response.tracks.items[0].preview_url);
      console.log(response.tracks.items[0].album.name);
    });
}

function getMovieInfo() {
  request(`http://www.omdbapi.com/?t=${value}&y=&plot=short&apikey=trilogy`, function(error, response, body) {
    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log(`Title: ${JSON.parse(body).Title}`);
    console.log(`Release Date: ${JSON.parse(body).Year}`);
    console.log(`Rating: ${JSON.parse(body).Rated}`);
    console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).tomatoRating}`);
    console.log(`Country: ${JSON.parse(body).Country}`);
    console.log(`Language: ${JSON.parse(body).Language}`);
    console.log(`Plot: ${JSON.parse(body).Plot}`);
    console.log(`Actors: ${JSON.parse(body).Rated}`);
  });
}

function movieThis() {
  if (value != null) {
    value = value.replace(/ /g, '+');
    getMovieInfo();
  } else if (value == null) {
    value = 'Mr.+Nobody';
    getMovieInfo();
  }
}
