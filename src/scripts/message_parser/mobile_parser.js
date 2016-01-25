
var lineReader = require('line-reader');

function MobileParser(_filepath) {
	this.filepath = _filepath;
}

//callback(time, user, message);
MobileParser.prototype = {
	message_parse: function(callback, end_callback) {
		var self = this;
		var image_regex = new RegExp("[\w]{1,}.(jpeg|png|gif)");
		lineReader.eachLine(this.filepath, function(line, last){
			if(line.contains(':')) {
				var result = line.split(':');
				var date_name = result[0].split(',');
				callback(date_name[0], date_name[1], result[1]);
			}
			if(last) {
				end_callback();
				return false;
			}
		});
	}
}

module.exports = MobileParser;
