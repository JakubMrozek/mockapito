
/**
 * Dependencies.
 * 
 */

var express = require('express');
var http = require('http');
var io = require('socket.io');


/**
 * Application.
 */
var app = express();
var server = http.createServer(app);
io = io.listen(server);
server.listen(process.env.PORT || 8000);


/**
 * Configuration.
 */
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(process.cwd() + '/public'));
app.use(express.favicon());
app.use(app.router);


/**
 * Router rules.
 * 
 */

app.get('/', function(req, res, next){
  res.render('index');
});




/**
 * Websocket rules.
 * 
 */
io.sockets.on('connection', function(socket){
  socket.emit('load', load());
  socket.on('save', save);
});


var fs = require('fs');

var load = function() {
  var content = fs.readFileSync('./mockapito.apib');
  return content.toString();
};

var save = function(content) {
  fs.writeFileSync('./mockapito.apib', content);
};