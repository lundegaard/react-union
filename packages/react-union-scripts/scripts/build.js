const webpack = require('webpack');
const fse = require('fs-extra');
const {
	map,
	test,
	complement,
	flatten,
	splitEvery,
	compose,
	head,
	prop,
	invoker,
	forEach,
} = require('ramda');
const path = require('path');

const { getUnionConfig, stats } = require('./lib/utils');
const configs = require('./webpack.config');

const getClientStatsList = compose(
	map(head),
	splitEvery(2),
	prop('children'),
	invoker(0, 'toJson')
);

function build() {
	return new Promise((resolve, reject) => {
		// FIXME: this will break for applications without SSR
		const flattenedConfigs = flatten(configs);

		webpack(flattenedConfigs).run((err, buildStats) => {
			if (err) {
				reject(err);
			} else {
				console.log(buildStats.toString(stats));

				forEach(
					clientStats =>
						fse.writeJsonSync(
							path.join(clientStats.outputPath, '.ssr', 'clientStats.json'),
							clientStats
						),
					getClientStatsList(buildStats)
				);

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
