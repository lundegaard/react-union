const webpack = require('webpack');
const fse = require('fs-extra');
const { map, test, complement } = require('ramda');

const { getUnionConfig, stats } = require('./lib/utils');
const configs = require('./webpack.config');

function build() {
	return new Promise((resolve, reject) => {
		webpack(configs).run((err, buildStats) => {
			if (err) {
				reject(err);
			} else {
				console.log(buildStats.toString(stats));

				copyPublicFolder(getUnionConfig());

				resolve();
			}
		});
	});
}

const copyPublicFolder = map(config => {
	fse.copySync(config.paths.public, config.paths.build, {
		dereference: true,
		filter: complement(test(config.copyToPublicIgnore)),
	});
});

module.exports = build;
