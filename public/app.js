var socket = io.connect('http://localhost:8000');
var contentElement = document.getElementById('content');


function Loader(element) {
	this.interval = null;
	this.element = element;
};

Loader.prototype.setInterval = function() {
  this.interval = setInterval(this.save.bind(this) , 500);
};

Loader.prototype.clearInterval = function() {
  window.clearInterval(this.interval);
};

Loader.prototype.load = function(data) {
	this.element.value = data;
	this.content = data;
};

Loader.prototype.save = function() {
	if (this.content == this.element.value) {
		return false;
	}
	socket.emit('save', this.element.value);
	this.content = this.element.value;
};


var loader = new Loader(contentElement);

socket.on('connect', function(){
	loader.setInterval();
});

socket.on('disconnect', function(){
	loader.clearInterval();
});

socket.on('load', function(data){
	loader.load(data);
});