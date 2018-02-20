const config = require('../config0.json');
const twitter = require('API/Twitter');

let client = new twitter({
    consumer_key:config.twitter.api_key,
    consumer_secret: config.twitter.api_secret,
    access_token_key: config.twitter.access_token,
    access_token_secret: config.twitter.access_token_secret
});

client.get('search/tweets', {q: 'csgo'}, function(error, tweets, response) {
    console.log(tweets.statuses[0].entities.urls);
});