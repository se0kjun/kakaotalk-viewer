
var lineReader = require('line-reader');

function MobileParser(_filepath) {
	this.filepath = _filepath;
}

//callback(time, user, message, type);
// 2015년 8월 23일 오후 10:39, 회원님 : 콜링컨벤션때문에 개삽질했네
MobileParser.prototype = {
	message_parse: function(callback, end_callback) {
		var self = this;
		var image_regex = new RegExp("[\\w+].(jpg|jpeg|png|gif)$", "g"),
			message_regex = new RegExp("^([(\\d)|(가-힣)|\\s]+),", "g"),
			date_regex = new RegExp("", "g");

		lineReader.eachLine(this.filepath, function(line, last){
			var delim_index;
			if((delim_index = line.indexOf(',')) !== -1) {
				var date_time = line.substring(0, delim_index).match(/\d+/g);
				var user_date_time = new Date(
					date_time[0], date_time[1], date_time[2], 
					(line.substring(0, delim_index).indexOf("오전") !== -1) ? date_time[3] : (parseInt(date_time[3]) + 12).toString(), 
					date_time[4]);

				var message_content = line.substring(delim_index);

				var user_name = message_content.substring(1, message_content.indexOf(':'));
				var user_message = message_content.substring(message_content.indexOf(':') + 2);

				if(!image_regex.test(user_message)) {
					callback(user_date_time, user_name, user_message, "message");
				} else {
					var media_path;
					if(process.platform == "darwin") {
						media_path = self.filepath.substring(0, self.filepath.lastIndexOf('/')+1);
					}
					else if(process.platform == "win") {
						media_path = self.filepath.substring(0, self.filepath.lastIndexOf('\\')+1);
					}
					callback(user_date_time, user_name, media_path + user_message.trim(), "media");
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
