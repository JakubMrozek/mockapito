
/**
 * Dependencies.
 * 
 */

var express = require('express');
var http = require('http');
var io = require('socket.io');
var File = require('./lib/File');


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
  socket.emit('load', file.get());
  socket.on('save', file.save);
});


/**
 * Process all requests.
 * 
 */

var file = new File();
app.all('*', function(req, res, next) {
  var result = file.find(req.method, req.url);
  for (var header in result.headers) {
  	res.set(header, result.headers[header]);
  }
  res.send(result.status, result.body);
});