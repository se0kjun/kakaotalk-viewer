
var remote = require('remote');
var dialog = remote.require('dialog');

var Event = {
	open_file: function() {
		dialog.showOpenDialog({properties: ['openFile']}, function(filename) {
			document.getElementById('file_text').value = filename.toString();
			addHistory(filename.toString()); 
		});
	}
}

function addHistory(filepath) {
}