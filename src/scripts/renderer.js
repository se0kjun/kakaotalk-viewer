
var remote = require('electron-prebuilt').remote;
var dialog = remote.require('dialog');
var parser_type = require('./parser');
var mac_parser = require('./message_parser/mac_parser');

var React = require("react"),
	ReactDOM = require("react-dom");

var HistoryWrapper = React.createClass({
	propTypes: {
		histories: React.PropTypes.array.isRequired,
		history_view: React.PropTypes.func.isRequired
	},

	getDefaultProps: function(){
		return {
			histories: []
		}
	},

	render: function() {
		var histories = this.props.histories.map(function(history){
			return (
				<li className="list-group-item">
					<a  className="history-list" onClick={this.props.history_view}>
						{history}
					</a>
				</li>
			)
		}.bind(this));

		return (
			<ul className="list-group" id="sidebar">
				<li className="list-group-item"><h4>History</h4></li>
				{histories}
			</ul>
		);
	}
});

var MessageWrapper = React.createClass({
	getInitialState: function() {
		return {
			messages: [],
			loading: false
		}
	},

	componentWillReceiveProps: function(props) {
		this.setState({
			loading: true
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

		var messages = this.state.messages.map(function(m){
			return (
				<div className="message">
					<span>{m.time}</span>
					<span>{m.user}</span>
					<span>{m.message}</span>
				</div>
			)
		});

		return (
			<div className={class_name}>
				{messages}
			</div>
		);
	}
});

var App = React.createClass({
	getInitialState: function() {
		return {
			data: null,
			file_name: null,
			histories: []
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
					histories: self.state.histories.concat([filename.toString()])
				});
			});
	},

	openHistory: function(click_history) {
		this.setState({
			file_name: click_history.currentTarget.innerHTML
		});
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-md-3 sidebar">
					<HistoryWrapper histories={this.state.histories} history_view={this.openHistory} />
				</div>
				<div className="col-md-9">
					<div className="file-load row">
						<div className="col-md-10">
							<input type="text" className="form-control" id="file_text" onSubmit={this.test} value={this.state.file_name}/>
						</div>
						<div className="col-md-2">
							<button id="open_file" onClick={this.openFile} className="btn btn-primary">Open</button>
						</div>
					</div>
					<div id="message_container" className="message-wrapper">
						<MessageWrapper message_file={this.state.file_name} />
					</div>
				</div>
			</div>
		);
	}
});

ReactDOM.render(
	<App/>,
	document.getElementById("content-wrapper")
);
