
var lineReader = require('line-reader');

function MacParser(_filepath) {
	this.filepath = _filepath;
}

//callback(time, user, message);
MacParser.prototype = {
	message_parse: function(callback, end_callback) {
		var self = this;
		lineReader.eachLine(this.filepath, function(line, last){
			var result = line.split(',');
			if(result.length == 3) 
				callback(
					new Date(result[0]), 
					result[1].substring(1, result[1].length-1), 
					result[2].substring(1, result[2].length-1), 
					"message");
			if(last) {
				end_callback();
				return false;
			}
		});
	}
}

module.exports = MacParser;
