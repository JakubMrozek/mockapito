var fs = require('fs');
var parser  = require('apiary-blueprint-parser');

function File() {
  this.load();
  this.watch();
}

File.FILE = process.cwd() + '/mockapito.apib';

File.prototype.get = function() {
  return fs.readFileSync(File.FILE).toString();
};

File.prototype.load = function() {
	this.rules = [];

  var data = parser.parse(this.get());
	for (var i = 0; i < data.sections.length; ++i) {
		var resources = data.sections[i].resources;
		for (var ii = 0; ii < resources.length; ++ii) {
			var rule = resources[ii];
			this.rules.push({
				url: rule.url, 
				method: rule.method,
				headers: rule.responses[0].headers,
				status: rule.responses[0].status,
				body: rule.responses[0].body
			});
		}
	}
  this.content = data;
};

File.prototype.save = function(content) {
  fs.writeFileSync(File.FILE, content);
};

File.prototype.watch = function() {
  fs.watchFile(File.FILE, this.load.bind(this));
};

File.prototype.find = function(method, url) {
  for (var i = 0; i < this.rules.length; ++i) {
  	if (this.check(method, url, this.rules[i])) {
  		return this.rules[i];
  	}
  }
};

File.prototype.check = function(method, url, rule) {
  if (rule.method === method && rule.url === url) {
  	return true;
  }
  return false;
};

module.exports = File;