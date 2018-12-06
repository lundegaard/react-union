/* eslint-disable import/no-dynamic-require */
const invariant = require('invariant');
const merge = require('webpack-merge');
const path = require('path');

const cli = require('./lib/cli');
const { getUnionConfig, getAppConfig, mergeWhen, getForMode } = require('./lib/utils');
const { loadCSS, loadFiles, loadImages, loadJS } = require('./webpack/loaders.parts');
const {
	loaderOptionsPlugin,
	definePlugin,
	htmlPlugin,
	hmrPlugin,
	manifestPlugin,
	analyzeBundlePlugin,
	uglifyJsPlugin,
	cleanPlugin,
} = require('./webpack/plugins.parts');
const { optimization, performanceHints, context } = require('./webpack/common.parts');

const buildMode = getForMode('development', 'production');
const buildModeString = getForMode('"development"', '"production"');

/** if true, we are building bundles for all of the modules in 'configs' */
const buildingAll = !cli.app;

if (cli.proxy) {
	console.log('Starting proxy.');
}

console.log(`Optimizing for ${buildMode} mode.`);

const GLOBALS = {
	__DEV__: cli.debug, //  alias for `process.env.NODE_ENV === 'development'
	'process.env.BROWSER': true,
	'process.env.BABEL_ENV': buildModeString,
	'process.env.NODE_ENV': buildModeString,
};

const getWebpackConfig_ = config => {
	const {
		paths,
		name: appName,
		proxy,
		generateTemplate,
		publicPath,
		outputMapper,
		mergeWebpackConfig,
		sourceMaps,
	} = config;

	const hmr = cli.script === 'start' && cli.debug && !cli.noHmr;

	const outputPath = paths.build;

	const outputFilename = getForMode('[name].bundle.js', '[name].[chunkhash:8].bundle.js');
	const outputChunkname = getForMode('[name].chunk.js', '[name].[chunkhash:8].chunk.js');

	const commonConfig = merge(
		{ mode: buildMode },
		{
			entry: {
				[appName]: [
					...(hmr ? [require.resolve('webpack-hot-middleware/client')] : []),
					paths.index,
				],
			},
			output: {
				path: path.resolve(outputPath),
				filename: `${outputMapper.js}/${outputFilename}`,
				chunkFilename: `${outputMapper.js}/${outputChunkname}`,
				publicPath: cli.proxy ? proxy.publicPath : publicPath,
				sourcePrefix: '  ',
				pathinfo: cli.debug,
			},
		},
		loadJS(),
		loadCSS(),
		loadImages(config),
		loadFiles(config),
		definePlugin(GLOBALS),
		cleanPlugin(config),
		context(),
		performanceHints,
		mergeWhen(cli.analyze, analyzeBundlePlugin),
		optimization(),
		manifestPlugin()
	);

	const devWebpack = () =>
		merge(
			commonConfig,
			{ devtool: 'cheap-source-map' },
			loaderOptionsPlugin(true),
			mergeWhen(hmr, hmrPlugin),
			mergeWhen(generateTemplate, htmlPlugin, config, outputPath)
		);

	const prodWebpack = () =>
		merge(
			commonConfig,
			{
				bail: true,
				devtool: sourceMaps ? 'source-map' : false,
			},
			uglifyJsPlugin(cli.verbose, config)
		);

	return mergeWebpackConfig(cli.debug ? devWebpack() : prodWebpack());
};

const buildSingle_ = () => {
	const config = getAppConfig();
	invariant(config, `Missing configuration for the app called '${cli.app}'.`);

	return [getWebpackConfig_(config)];
};

const buildAll_ = () => getUnionConfig().map(getWebpackConfig_);

/**
 * If building from root directory all modules in `union.config.js` are built.
 * If --app is set, than build just the --app.
 */
module.exports = buildingAll ? buildAll_() : buildSingle_();
