var path = require('path');

var sourceRoot = path.join(path.join(__dirname, ''), 'src/scripts');

module.exports = {
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
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015']
				}
			}
		]
	},
	resolveLoader: {
		extensions : ['', '.js', '.jsx'],
		modulesDirectories: ['./node_modules']
	}
}