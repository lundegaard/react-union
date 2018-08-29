const webpack = require('webpack');
const fse = require('fs-extra');
const fs = require('fs');
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

const prependClientStats = clientStats => {
	const bundlePath = path.join(clientStats.outputPath, '.ssr');
	const bundleContent = fs.readFileSync(path.join(bundlePath, 'main.js'));

	fs.writeFileSync(
		path.join(bundlePath, 'index.js'),
		`var SSR_CLIENT_STATS = ${JSON.stringify(clientStats)};${bundleContent}`
	);
};

function build() {
	return new Promise((resolve, reject) => {
		// FIXME: this will break for applications without SSR
		const flattenedConfigs = flatten(configs);

		webpack(flattenedConfigs).run((err, buildStats) => {
			if (err) {
				reject(err);
			} else {
				console.log(buildStats.toString(stats));
				forEach(prependClientStats, getClientStatsList(buildStats));
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
