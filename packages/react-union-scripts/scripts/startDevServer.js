const invariant = require('invariant');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const R = require('ramda');
const R_ = require('ramda-extension');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxyMiddleware = require('http-proxy-middleware');
const historyApiFallback = require('connect-history-api-fallback');
const configs = require('./webpack.config');
const cli = require('./lib/cli');
const { stats, getAppConfig } = require('./lib/utils');

// webpack 4.0 compatible. based on impl from webpack dev-server
const getProxyMiddleware = ({ proxy } = {}) => {
	if (!proxy) {
		return [];
	}
	let normalizedConfig = proxy;
	if (!R_.isArray(proxy)) {
		normalizedConfig = R.pipe(
			R.mapObjIndexed((target, context) => {
				// for more info see https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L193
				const correctedContext = R.o(R.replace(/\/\*$/, ''), R.replace(/^\*$/, '**'))(context);
				if (R_.isString(target)) {
					return {
						context: correctedContext,
						target,
					};
				} else {
					return {
						...target,
						context: correctedContext,
					};
				}
			}),
			R.values
		)(proxy);
	}
	return R.map(config => {
		const proxyConfig = R_.isFunction(config) ? config() : config;
		return proxyMiddleware(proxyConfig.context, proxyConfig);
	}, normalizedConfig);
};

async function startDevServer() {
	invariant(
		configs && configs.length === 1,
		'You can start DEV Sever only for one module at the same time.'
	);

	const webpackConfigs = configs[0];
	const clientConfig = webpackConfigs[0];
	const unionConfig = getAppConfig();

	invariant(!cli.proxy || unionConfig.proxy.port, "Missing 'port' for proxy in your union.config.");
	invariant(
		!cli.proxy || unionConfig.proxy.target,
		"Missing 'target' for proxy in your union.config"
	);

	const compiler = webpack(webpackConfigs);
	const clientCompiler = compiler.compilers[0];

	const middleware = [
		webpackDevMiddleware(compiler, {
			publicPath: clientConfig.output.publicPath,
			stats,
		}),
		webpackHotMiddleware(clientCompiler),
		...(!cli.proxy && unionConfig.devServer.historyApiFallback
			? [
					historyApiFallback({
						disableDotRule: true,
						htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
					}),
			  ]
			: []),
		...getProxyMiddleware(clientConfig.devServer),
	];

	const baseDirs = [clientConfig.output.path, unionConfig.paths.public];

	const config = cli.proxy
		? {
				port: unionConfig.proxy.port,
				proxy: {
					target: unionConfig.proxy.target,
					middleware,
				},
				serveStatic: baseDirs,
		  }
		: {
				port: unionConfig.devServer.port,
				server: {
					baseDir: baseDirs,
					middleware,
				},
		  };

	browserSync.create().init({
		ui: false,
		...config,
	});
}
module.exports = startDevServer;
