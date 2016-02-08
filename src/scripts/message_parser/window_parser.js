
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
		var date_regex = new RegExp("[(\\d)|(가-힣)|\\s]+", "g");
		var message_date = "";

		lineReader.eachLine(this.filepath, function(line, last){
			var message_regex = new RegExp("\[(오전|오후) [\\d]{1,}:[\\d]{1,}\]", "g");
			var result = message_regex.exec(line);

			if(result !== null) {
				var date = message_date.match(/\d+/g),
					time = result[0].match(/\d+/g);

				callback(new Date(date[0], date[1], date[2], (result[0].indexOf("오전") !== -1) ? time[0] : (parseInt(time[0]) + 12).toString(), time[1]), 
					line.substring(1, result.index-1),
					line.substring(message_regex.lastIndex), "message");
			}
			else {
				if(date_regex.test(line)) {
					message_date = line.match(date_regex)[0];
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
