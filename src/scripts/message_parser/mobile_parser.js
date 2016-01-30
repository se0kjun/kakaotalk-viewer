
var lineReader = require('line-reader');

function MobileParser(_filepath) {
	this.filepath = _filepath;
}

//callback(time, user, message, type);
MobileParser.prototype = {
	message_parse: function(callback, end_callback) {
		var self = this;
		var image_regex = new RegExp("[\\w]{1,}.(jpeg|png|gif)", "g");
		lineReader.eachLine(this.filepath, function(line, last){
			if(line.indexOf(':') != -1) {
				var result = line.split(':');
				var date_name = result[0].split(',');
				var image_check = result[1].match(image_regex);
				if(image_check == null || image_check.length === 0)
					callback(date_name[0], date_name[1], result[1], "message");
				else {
					var media_path;
					if(process.platform == "darwin") {
						media_path = this.filepath.substring(0, this.filepath.lastIndexOf('/')+1);
					}
					else if(process.platform == "win") {
						media_path = this.filepath.substring(0, this.filepath.lastIndexOf('\\')+1);
					}
					callback(date_name[0], date_name[1], media_path + image_check[0], "media");
				}
			}
			if(last) {
				end_callback();
				return false;
			}
		});
	}
}

module.exports = MobileParser;
