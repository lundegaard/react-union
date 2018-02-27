const invariant = require('invariant');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const configs = require('./webpack.config');
const { app, proxy } = require('./lib/cli');
const { stats, getAppConfig } = require('./lib/utils');

function startDevServer() {
	invariant(
		configs && configs.length === 1,
		'You can start DEV Sever only for one module at the same time.'
	);

	const webpackConfig = configs[0];
	const unionConfig = getAppConfig(app);

	invariant(!proxy || unionConfig.proxy.port, "Missing 'port' for proxy in your union.config.");
	invariant(!proxy || unionConfig.proxy.target, "Missing 'target' for proxy in your union.config");

	return new Promise(resolve => {
		const compiler = webpack(webpackConfig);
		const handleCompilerComplete = () => {
			const middleware = [
				webpackDevMiddleware(compiler, {
					publicPath: webpackConfig.output.publicPath,
					stats,
				}),
				webpackHotMiddleware(compiler),
			];

			const baseDirs = [webpackConfig.output.path, unionConfig.paths.public];

			const config = proxy
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

			browserSync.create().init(
				{
					ui: false,
					...config,
				},
				resolve
			);
		};

		compiler.run(handleCompilerComplete);
	});
}
module.exports = startDevServer;
