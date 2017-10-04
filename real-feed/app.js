var app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs');

app.listen(1337);

var Twitter = require('node-tweet-stream'), t = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  token: '',
  token_secret: ''
})

t.track('燃える紙飛行機');
t.on('tweet', function (tweet) {
    console.log('tweet received', tweet);
    io.emit('tweet', tweet);
});

t.on('error', function (err) {
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