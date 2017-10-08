var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cfg = require('./config.json');
var tw = require('node-tweet-stream')(cfg);
var twn = require('node-tweet-stream')(cfg);
var Twitter = require('twitter');

http.listen(3000, function(){
    console.log('listening on *:3000');
});

/** Grap tweets on connect */
var clients = 0;
var client = new Twitter(cfg);
var params = {
    q:"燃える紙飛行機",
    result_type: 'recent',
    count:5,
    include_entities: true
};
io.on('connection', function(socket){
	clients++;
    console.log('Users connected: '+clients);
    client.get('search/tweets', params, function(error, tweets, response){
        if(error) {
            console.log(error);
            return;
        }

        for(i=4;i>=0;i--){
            socket.emit('tweet', tweets['statuses'][i]);
        }
    });

    socket.on('disconnect', function(){
		console.log('Users connected: '+clients);
		clients--;
	});
});

/** Track twitter */
tw.track('燃える紙飛行機');
tw.track('SaveJapariPark');
tw.track('フレンズ笑顔プロジェクト');
tw.track('けものフレンズを信じろ');
tw.on('tweet', function (tweet) {
    io.emit('tweet', tweet);
});

tw.on('error', function (err) {
    console.log('Oh no');
});

/** News tracker */
twn.track('#世界Friends應援ヤオヨロズ');
twn.track('#Love_the_park');
twn.track('#けものフレンズ');
twn.on('tweet', function (tweet) {
    io.emit('tweet news', tweet);
});

twn.on('error', function (err) {
    console.log('Oh no');
});