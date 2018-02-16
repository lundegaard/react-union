const webpack = require('webpack');

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

module.exports = build;
