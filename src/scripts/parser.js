
var line_reader = require('readline');
var remote = require('remote');
var BrowserWindow = remote.require('browser-window');

function ParserType(_filepath) {
	this.lineReader = require('readline').createInterface({
	  input: require('fs').createReadStream(_filepath)
	});

	if(process.platform == "darwin") {
		this.delim = '/';
	}
	else if(process.platform == "win") {
		this.delim = '\\';
	}

	this.filepath = _filepath;
	this.filename = this.filepath.substring(this.filepath.lastIndexOf(this.delim)+1, this.filepath.length);
	this.filext = this.filename.substring(this.filename.lastIndexOf('.')+1, this.filename.length);
}

ParserType.prototype = {
	isMac: function() {
		if(this.filext == "csv") {
			return true;
		} else {
			return false;
		}
	},

	isWindows: function() {
	}
}

module.exports = ParserType;