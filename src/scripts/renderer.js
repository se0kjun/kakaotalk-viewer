
var remote = require('remote');
var dialog = remote.require('dialog');
var update = require('react-addons-update');
var React = require('react');
var parser_type = require('./src/scripts/parser');
var mac_parser = require('./src/scripts/message_parser/mac_parser');

var HistoryWrapper = React.createClass({
	render: function() {
		var self = this;

		return (
			<ul className="nav nav-list" id="sidebar">
				<li className="nav-header">History</li>
				<li className="divider"></li>
				{
					this.props.histories.map(function(history){
						return <li><a href="#" className="history-list" onClick={self.props.history_view}>{history}</a></li>
					})
				}
			</ul>
		);
	}
});

var MessageWrapper = React.createClass({
	getInitialState: function() {
		return {
			messages: [],
			loading: false,
		}
	},

	componentWillReceiveProps: function(props) {
		this.setState({
			loading: true,
		});
		var self = this;
		var a = new parser_type(props.message_file);
		a.isMac();
		var b = new mac_parser(props.message_file);
		var newArray = [];

		b.message_parse(function(t, u, m) {
			newArray.push(
				{
					time:t,
					user:u, 
					message:m
				});
		}, function() {
			self.setState({
				loading: false,
				messages: newArray
			});

			return false;
		});
	},

	render: function() {
		var class_name = "loader";
		if(!this.state.loading) {
			class_name = "unload";
		}

		return (
			<div className={class_name}>
				{this.state.messages.map(function(m){
					return (
						<div className="message">
							<span>{m.time}</span>
							<span>{m.user}</span>
							<span>{m.message}</span>
						</div>
					);
				})}
			</div>
		);
	}
});

var App = React.createClass({ 
	getInitialState: function() {
		return {
			data: null,
			file_name: null,
			histories: [],
		}
	},

	openFile: function() {
		var self = this;
		dialog.showOpenDialog(
			{
				properties: ['openFile']
			}, 
			function(filename) {
				self.setState({
					file_name: filename.toString(),
					histories: self.state.histories.concat([filename.toString()]),
				});
			});
	},

	openHistory: function(g) {
		console.log(g.currentTarget);
		// this.setState({
		// 	file_name: 
		// });
	},

	render: function() {
		return (
			<div classNameName="container">
				<div className="well sidebar-list">
					<HistoryWrapper histories={this.state.histories} history_view={this.openHistory} />
				</div>
				<div className="file-load">
					<input type="text" id="file_text" onSubmit={this.test} value={this.state.file_name}/>
					<button id="open_file" onClick={this.openFile} className="form-control">Open</button>
				</div>
				<div id="message_container" className="message-wrapper">
					<MessageWrapper message_file={this.state.file_name} />
				</div>
			</div>
		);
	}
});

React.render(
	<App />,
	document.getElementById('content-wrapper')
);