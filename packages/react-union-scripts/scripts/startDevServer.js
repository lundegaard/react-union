const invariant = require('invariant');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const historyApiFallback = require('connect-history-api-fallback');
const configs = require('./webpack.config');
const cli = require('./lib/cli');
const { stats, getAppConfig } = require('./lib/utils');

function startDevServer() {
	invariant(
		configs && configs.length === 1,
		'You can start DEV Sever only for one module at the same time.'
	);

	const webpackConfig = configs[0];
	const unionConfig = getAppConfig();

	invariant(!cli.proxy || unionConfig.proxy.port, "Missing 'port' for proxy in your union.config.");
	invariant(
		!cli.proxy || unionConfig.proxy.target,
		"Missing 'target' for proxy in your union.config"
	);

	return new Promise(resolve => {
		const compiler = webpack(webpackConfig);
		const handleCompilerComplete = () => {
			const middleware = [
				webpackDevMiddleware(compiler, {
					publicPath: webpackConfig.output.publicPath,
					stats,
				}),
				webpackHotMiddleware(compiler),
				...(!cli.proxy && unionConfig.devServer.historyApiFallback
					? [
							historyApiFallback({
								disableDotRule: true,
								htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
							}),
					  ]
					: []),
			];

			const baseDirs = [webpackConfig.output.path, unionConfig.paths.public];

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
