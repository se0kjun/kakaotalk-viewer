
var remote = require('remote');
var dialog = remote.require('dialog');
var parser_type = require('./src/scripts/parser');
var mac_parser = require('./src/scripts/message_parser/mac_parser');

var Event = {
	open_file: function() {
		dialog.showOpenDialog(
			{
				properties: ['openFile']
			}, 
			function(filename) {
				document.getElementById('file_text').value = filename.toString();
				addHistory(filename.toString()); 
			});
	}
}

function addHistory(filepath) {
	a = new parser_type(filepath);
	a.isMac();
	b = new mac_parser(filepath);
	b.message_parse(function(t, u, m) {
		var node = document.createElement("div");
		node.innerHTML = t;
		document.getElementById('message_container').appendChild(node);
		node.innerHTML = u;
		document.getElementById('message_container').appendChild(node);
		node.innerHTML = m;
		document.getElementById('message_container').appendChild(node);
	});
}