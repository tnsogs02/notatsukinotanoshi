var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cfg = require('./config.json');
var tw = require('node-tweet-stream')(cfg);
var Twitter = require('twitter');

/* app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
}); */

http.listen(3000, function(){
    console.log('listening on *:3000');
});

/** Grap tweets on connect */
var client = new Twitter(cfg);
var params = {
    q:"燃える紙飛行機",
    result_type: 'mixed',
    count:5,
    include_entities: true
};
io.on('connection', function(socket){
    console.log('a user connected');
    client.get('search/tweets', params, function(error, tweets, response){
        if(error) {
            console.log(error)
            throw error;
        }
        tweets['statuses'].forEach(function(element) {
            console.log(element);
        }, this);
        socket.emit('tweet', tweets);
    });
});

/** Track twitter */
tw.track('燃える紙飛行機');
tw.on('tweet', function (tweet) {
    console.log('tweet received', tweet);
    io.emit('tweet', tweet);
});

tw.on('error', function (err) {
    console.log('Oh no');
});