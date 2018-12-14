const webpack = require('webpack');
const { promisify } = require('util');
const fse = require('fs-extra');
const fs = require('fs');
const { test, complement, flatten, propEq, filter, prop, forEach, o, map, head } = require('ramda');
const { rejectNil } = require('ramda-extension');
const path = require('path');

const { getUnionConfig, stats } = require('./lib/utils');
const cli = require('./lib/cli');
const webpackConfigs = require('./webpack.config');

const getClientStatsList = o(filter(propEq('name', 'client')), prop('children'));

const prependClientStats = clientStats => {
	const bundlePath = path.join(clientStats.outputPath, 'server.js');

	if (fs.existsSync(bundlePath)) {
		fs.writeFileSync(
			bundlePath,
			`global.ssr_clientStats=${JSON.stringify(clientStats)};${fs.readFileSync(bundlePath)}`
		);
	}
};

const getWebpackConfigsToBuild = cli.noSSR ? map(head) : o(rejectNil, flatten);

async function build() {
	const webpackConfigsToBuild = getWebpackConfigsToBuild(webpackConfigs);
	const compiler = webpack(webpackConfigsToBuild);
	const run = promisify(compiler.run.bind(compiler));

	const buildStats = await run();
	console.log(buildStats.toString(stats));

	if (!cli.noSSR) {
		forEach(prependClientStats, getClientStatsList(buildStats.toJson()));
	}

	copyPublicFolder(getUnionConfig());
}

const copyPublicFolder = forEach(config => {
	fse.copySync(config.paths.public, config.paths.build, {
		dereference: true,
		filter: complement(test(config.copyToPublicIgnore)),
	});
});

module.exports = build;
