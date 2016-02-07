var path = require('path');
var webpack = require('webpack');

var sourceRoot = path.join(path.join(__dirname, ''), 'src/scripts');

var config = {
	entry: path.join(sourceRoot, "renderer"),
	target: "electron",
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015']
				}
			},
			{
			    test: /\.scss$/,
			    loaders: 'style!css!sass'
			},
			{
			    test: /\.css$/,
			    loaders: ["style-loader", "css-loader"]
			},
			{
			  	test: /\.less$/,
			  	loader: "style!css!less"
			},
			{
			    test: /\.json$/,
			    loader: "json-loader" 
			},

			{ test: /\.woff$/,   loader: 'url?limit=5000&mimetype=application/font-woff' },
			{ test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
			{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
			{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=8192" },
			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" },
			{ test: /\.png$/,    loader: 'url?limit=8192&mimetype=image/png' },
		]
	},
	resolve: {
		alias: {
			jquery: "../../bower_components/jquery/dist/jquery.min.js",
			semantic: "./semantic.min.js"
		},
		modulesDirectories: ['./node_modules']
	},
	plugins: [
	    new webpack.ProvidePlugin({
	        $: "jquery",
	        jQuery: "jquery"
	    })
	]
}

module.exports = config;