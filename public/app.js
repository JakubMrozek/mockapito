var socket = io.connect('http://localhost:8000');
var contentElement = document.getElementById('content');

function Loader() {
	this.interval = null;
};

Loader.prototype.setInterval = function() {
  this.interval = setInterval(this.save.bind(this) , 1000);
};

Loader.prototype.clearInterval = function() {
  window.clearInterval(this.interval);
};

Loader.prototype.save = function() {
	socket.emit('save', contentElement.value);
};



var loader = new Loader();


socket.on('connect', function(){
	loader.setInterval();
});

socket.on('disconnect', function(){
	loader.clearInterval();
});

socket.on('load', function(data){
	contentElement.value = data;
});