
var remote = window.require('remote');
var dialog = remote.require('dialog');
var parser_type = require('./parser');
var mac_parser = require('./message_parser/mac_parser');
var mobile_parser = require('./message_parser/mobile_parser');
var window_parser = require('./message_parser/window_parser');

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
				<a className="item" onClick={this.props.history_view}>
					{history}
				</a>
			)
		}.bind(this));

		return (
			<div className="ui dropdown item">
				History <i className="dropdown icon"></i>
				<div className="menu">
					{histories}
				</div>
			</div>
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
		var c = new mobile_parser(props.message_file);
		c.message_parse(function(t, u, m, type) {
			newArray.push(
				{
					time:t,
					user:u,
					message:m,
					message_type: type
				});
		}, function() {
			self.setState({
				loading: false,
				messages: newArray
			});

			return false;
		});
		// b.message_parse(function(t, u, m, type) {
		// 	newArray.push(
		// 		{
		// 			time:t,
		// 			user:u,
		// 			message:m
		// 		});
		// }, function() {
		// 	self.setState({
		// 		loading: false,
		// 		messages: newArray
		// 	});

		// 	return false;
		// });
	},

	render: function() {
		var class_name = "ui divided items loader";
		if(!this.state.loading) {
			class_name = "ui divided items unload";
		}

		var messages = this.state.messages.map(function(m){
			var message_element = (m.message_type == "media") 
				? <div className="ui small image"><img src={m.message}/></div> : null;

			return (
				<div className="item">
					{message_element}
					<div className="content">
						<div className="header">
							{m.user}
						</div>
						<div className="meta">
							<span className="time">{m.time}</span>
						</div>
						<div className="description">
							<p>{m.message}</p>
						</div>
					</div>
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

var MenuNav = React.createClass({
	propTypes: {
		histories: React.PropTypes.array.isRequired,
		history_view: React.PropTypes.func.isRequired,
		open_file: React.PropTypes.func.isRequired
	},

	render: function() {
		return (
			<div className="ui menu">
				<HistoryWrapper histories={this.props.histories} history_view={this.props.history_view}  />
				<div className="right menu">
					<div className="item">
						<input placeholder="Search..." type="text" />
						<i className="search icon"></i>
					</div>
					<div className="item">
						<button id="open_file" onClick={this.props.open_file} className="ui button">Open</button>
					</div>
				</div>
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
				<MenuNav histories={this.state.histories} history_view={this.openHistory} open_file={this.openFile} />
				<div className="col-md-9">
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
