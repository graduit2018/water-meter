var express = require('express'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io'),
    redis = require('redis');
var dataFromRedis = require('./redis-data');

var app = express();

//Server config
app.set('port', process.env.PORT || 9786);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

//Redis connection
var client = redis.createClient('6379', 'redis');
client.on('connect', function() {
    console.log('Redis is connected');
});

//route page dashboard
app.get('/', function(req, res) {
    dataFromRedis.getData(client, function(err, data) {
        res.render('index', data);
    })
});

//server listening
var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

//socket io
io = io.listen(server);
io.on('connection', function(socket) {
    console.log('Socket is connected!!');

    (function loopchart() {
        setTimeout(function() {
            dataFromRedis.getData(client, function(err, data) {
                socket.emit('loadChart', data);
                loopchart();
            })
        }, 500);
    }());

});
