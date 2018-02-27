const webpack = require('webpack');
const fs = require('fs');
const { stats } = require('./lib/utils');
const configs = require('./webpack.config');

function build() {
	return new Promise((resolve, reject) => {
		webpack(configs).run((err, buildStats) => {
			if (err) {
				reject(err);
			} else {
				console.log(buildStats.toString(stats));



				resolve();
			}
	 	});
	});
}
/*
function copyPublicFolder(config) {
	fs.copySync('public', config.output.path, {
		dereference: true,
		filter: file => file !== paths.appHtml,
	});
}
*/
module.exports = build;
