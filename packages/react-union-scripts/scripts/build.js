const webpack = require('webpack');
const path = require('path');
const fse = require('fs-extra');
const { compose, map } = require('ramda');
const { notEqual } = require('ramda-extension');

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
		filter: compose(notEqual(config.templateFilename), path.basename),
	});
});

module.exports = build;
