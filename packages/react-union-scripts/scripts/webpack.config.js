/* eslint-disable import/no-dynamic-require */
const invariant = require('invariant');
const merge = require('webpack-merge');
const path = require('path');

const cli = require('./lib/cli');
const { getUnionConfig, getAppConfig, mergeWhen, getForMode } = require('./lib/utils');
const {
	loadAsyncModules,
	loadBabel,
	loadCss,
	loadScss,
	loadImages,
	loadFiles,
} = require('./webpack/loaders.parts');
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
const { resolve, vendorBundle, performanceHints, context } = require('./webpack/common.parts');

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
		generateVendorBundle,
		publicPath,
		outputMapper,
		mergeWebpackConfig,
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
					require.resolve('babel-polyfill'),
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
		loadAsyncModules(config),
		loadBabel(),
		loadCss(),
		loadScss(cli.debug),
		loadImages(config),
		loadFiles(config),
		definePlugin(GLOBALS),
		cleanPlugin(config),
		resolve(),
		context(),
		performanceHints,
		mergeWhen(cli.analyze, analyzeBundlePlugin),
		mergeWhen(generateVendorBundle, vendorBundle, config)
	);

	const devWebpack = () =>
		merge(
			commonConfig,
			loaderOptionsPlugin(true),
			mergeWhen(hmr, hmrPlugin),
			mergeWhen(generateTemplate, htmlPlugin, config, outputPath),
			{
				devtool: 'source-map',
			}
		);

	const prodWebpack = () => merge(commonConfig, manifestPlugin(), uglifyJsPlugin(cli.verbose));

	return mergeWebpackConfig(cli.debug ? devWebpack() : prodWebpack());
};

const buildSingle_ = () => {
	const config = getAppConfig(cli.app);
	invariant(config, `Missing configuration for the app called '${cli.app}'.`);

	return [getWebpackConfig_(config)];
};

const buildAll_ = () => getUnionConfig().map(getWebpackConfig_);

/**
 * If building from root directory all modules in `union.config.js` are built.
 * If --app is set, than build just the --app.
 */
module.exports = buildingAll ? buildAll_() : buildSingle_();
