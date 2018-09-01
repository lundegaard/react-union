const webpack = require('webpack');
const { promisify } = require('util');
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
	const ssrPath = path.join(clientStats.outputPath, 'server');
	const originalBundlePath = path.join(ssrPath, 'main.js');
	const originalBundleContent = fs.readFileSync(originalBundlePath);
	const newBundlePath = path.join(ssrPath, 'index.js');

	fs.unlinkSync(originalBundlePath);
	fs.writeFileSync(
		newBundlePath,
		`global.SSR_CLIENT_STATS = ${JSON.stringify(clientStats)};${originalBundleContent}`
	);
};

async function build() {
	// FIXME: this will break for applications without SSR
	const flattenedConfigs = flatten(configs);
	const compiler = webpack(flattenedConfigs);
	const run = promisify(compiler.run.bind(compiler));

	const buildStats = await run();
	console.log(buildStats.toString(stats));

	forEach(prependClientStats, getClientStatsList(buildStats));
	copyPublicFolder(getUnionConfig());
}

const copyPublicFolder = forEach(config => {
	fse.copySync(config.paths.public, config.paths.build, {
		dereference: true,
		filter: complement(test(config.copyToPublicIgnore)),
	});
});

module.exports = build;
