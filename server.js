
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
var parser  = require('apiary-blueprint-parser');

function Api() {
	this.content = null;
}

Api.prototype.load = function() {
  var content = fs.readFileSync('./mockapito.apib');
  this.content = parser.parse(content.toString());
};

Api.prototype.parse = function(method, url) {
	var sections = this.content.sections;
	for (var i = 0; i < sections.length; ++i) {
		var resources = sections[i].resources;
		for (var ii = 0; ii < resources.length; ++ii) {
			if (resources[ii].method === method && resources[ii].url === url) {
				return {
        	status: resources[ii].responses[0].status,
        	body: resources[ii].responses[0].body
        }
			}
		}
	}
};


var api = new Api();
api.load();

app.all('*', function(req, res, next) {
  var content = api.parse(req.method, req.url);
  res.type('json');
  res.send(content.status, content.body);
});



fs.watchFile('./mockapito.apib', function(cur, prev){
  api.load();
});

var load = function() {
  var content = fs.readFileSync('./mockapito.apib');
  return content.toString();
};

var save = function(content) {
  fs.writeFileSync('./mockapito.apib', content);
};

