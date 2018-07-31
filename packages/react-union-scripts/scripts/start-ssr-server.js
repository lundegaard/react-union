const fs = require('fs');
const path = require('path');
const invariant = require('invariant');
const createServer = require('react-union-ssr-server');

const { getAppConfig } = require('./lib/utils');
const cli = require('./lib/cli');
const webpackConfigs = require('./webpack.config');

async function startSsrServer() {
	invariant(
		webpackConfigs && webpackConfigs.length === 1,
		'You can start the SSR server only for one module at a time.'
	);

	const webpackConfig = webpackConfigs[0][1];
	const appConfig = getAppConfig(cli.app);

	const appHandlerPath = path.join(webpackConfig.output.path, webpackConfig.output.filename);

	const clientStatsPath = path.join(webpackConfig.output.path, 'clientStats.json');
	// eslint-disable-next-line import/no-dynamic-require
	const appHandler = require(appHandlerPath).default;

	const clientStats = JSON.parse(fs.readFileSync(clientStatsPath, 'utf-8'));

	const server = createServer(appConfig, appHandler, clientStats);
	const { port } = appConfig.ssrServer;

	server.listen(port);

	console.log(`🚀 SSR server is listening on port ${port} 🚀`);
}

module.exports = startSsrServer;
