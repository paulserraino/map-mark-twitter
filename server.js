var http = require('http')
  , fs = require('fs')
  , cred = require('./credentials')
  , twitter = require('ntwitter');


var server = http.createServer(function(req, res){
	var file = fs.readFileSync('map.html');
	res.writeHead(200, {'Content-Type':'text/html'});
	res.end(file);
});

server.listen(3000);
console.log('listening on port 3000...');
var io = require('socket.io').listen(server);

var credentials = {
	consumer_key: cred.consumer_key,
	consumer_secret: cred.consumer_secret,
	access_token_key: cred.access_token_key,
	access_token_secret: cred.access_token_secret
};

var t = new twitter(credentials);


t.stream(
	'statuses/filter',
	{ 'track':'twitter' },
	function(stream){
		stream.on('data', function(tweet){
			if (!(tweet.coordinates === null)){
				io.sockets.emit("tweets", tweet.geo.coordinates);
			}
		});
	}
);
