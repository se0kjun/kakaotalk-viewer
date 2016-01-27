
var lineReader = require('line-reader');

function WindowParser(_filepath) {
	this.filepath = _filepath;
}

//--------------- 2015년 11월 9일 월요일 ---------------
// [홍석준] [오후 12:44] 네네
//callback(time, user, message, type);
WindowParser.prototype = {
	message_parse: function(callback, end_callback) {
		var self = this;
		var date_regex = new RegExp("^--------------- (.*?) ---------------$", "g");
		var message_date = "";
		lineReader.eachLine(this.filepath, function(line, last){
			var message_regex = new RegExp("(오전|오후) [\d]{1,}:[\d]{1,}\]", "g");
			if((var result = message_regex.exec(line)) !== null) {
				callback(
					line.substring(0, result.index - 1),
					'[' + message_date + result[0],
					line.substring(message_regex.lastIndex),
					"message"
					);
			}
			else {
				if(date_regex.test(line)) {
					message_date = line.match(date_regex)[1];
				}
			}

			if(last) {
				end_callback();
				return false;
			}
		});
	}
}

module.exports = WindowParser;
