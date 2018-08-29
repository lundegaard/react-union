const webpack = require('webpack');
const { promisify } = require('util');
const fse = require('fs-extra');
const fs = require('fs');
const {
	map,
	test,
	complement,
	chain,
	values,
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

async function build() {
	// FIXME: this will break for applications without SSR
	const flattenedConfigs = chain(values, configs);
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
