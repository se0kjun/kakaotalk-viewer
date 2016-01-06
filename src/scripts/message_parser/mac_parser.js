
var line_reader = require('readline');

function MacParser(_filepath) {
	this.lineReader = require('readline').createInterface({
	  input: require('fs').createReadStream(_filepath)
	});
}

//callback(time, user, message);
MacParser.prototype = {
	message_parse: function(callback) {
		this.lineReader.on('line', function(line) {
			result = line.split(',');
			if(result.length == 3)
				callback(result[0], result[1], result[2]);
		});
	}
}

module.exports = MacParser;