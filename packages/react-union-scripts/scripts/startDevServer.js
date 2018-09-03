const invariant = require('invariant');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const { o } = require('ramda');
const { rejectNil } = require('ramda-extension');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const historyApiFallback = require('connect-history-api-fallback');
const createHotServerHandler = require('react-union-ssr-server/middleware');

const configs = require('./webpack.config');
const cli = require('./lib/cli');
const { stats, getAppConfig } = require('./lib/utils');
const { responseCaptureMiddleware, proxyMiddleware } = require('./lib/middleware');

async function startDevServer() {
	invariant(
		configs && configs.length === 1,
		'You can start the development server only for one module at a time.'
	);

	const webpackConfigs = configs[0];
	const clientConfig = webpackConfigs[0];
	const unionConfig = getAppConfig();

	const isSSR = webpackConfigs[1] && !cli.noSSR;

	invariant(!cli.proxy || unionConfig.proxy.port, "Missing 'port' for proxy in your union.config.");
	invariant(
		!cli.proxy || unionConfig.proxy.target,
		"Missing 'target' for proxy in your union.config."
	);

	const compiler = o(webpack, rejectNil)(webpackConfigs);
	const [clientCompiler] = compiler.compilers;

	const middleware = [
		...(isSSR ? [responseCaptureMiddleware] : []),
		webpackDevMiddleware(isSSR ? compiler : clientCompiler, {
			publicPath: clientConfig.output.publicPath,
			stats,
			serverSideRender: isSSR,
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
		...(isSSR
			? [
					webpackHotServerMiddleware(compiler, {
						createHandler: createHotServerHandler,
					}),
			  ]
			: []),
		...proxyMiddleware(clientConfig.devServer),
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
