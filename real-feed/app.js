var app = require('http').createServer(handler),
    io = require('socket.io')(app),
    cfg = require('./config.json'),
    fs = require('fs');

app.listen(1337);

var tw = require('node-tweet-stream')(cfg);

tw.track('燃える紙飛行機');
tw.on('tweet', function (tweet) {
    console.log('tweet received', tweet);
    io.emit('tweet', tweet);
});

tw.on('error', function (err) {
    console.log('Oh no');
})

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
  
      res.writeHead(200);
      res.end(data);
    });
}