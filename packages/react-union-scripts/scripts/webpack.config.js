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
	uglifyJSPlugin,
	cleanPlugin,
	limitChunkCountPlugin,
	extractCSSChunksPlugin,
} = require('./webpack/plugins.parts');
const { optimization, performanceHints, context } = require('./webpack/common.parts');

const buildMode = getForMode('development', 'production');

/** if true, we are building bundles for all of the modules in 'configs' */
const buildingAll = !cli.app;

if (cli.proxy) {
	console.log('Starting proxy.');
}

console.log(`Optimizing for ${buildMode} mode.`);

const createGlobals = isBrowser => ({
	__DEV__: cli.debug, //  alias for `process.env.NODE_ENV === 'development'
	'process.env.BROWSER': isBrowser,
});

const getWebpackConfig_ = (config, isServerConfig) => {
	const {
		paths,
		proxy,
		generateTemplate,
		publicPath,
		outputMapper,
		mergeWebpackConfig,
		sourceMaps,
	} = config;

	if (isServerConfig) {
		try {
			require.resolve(paths.ssrIndex);
		} catch (error) {
			return null;
		}
	}

	const isHot = cli.script === 'start' && cli.debug && !cli.noHMR;

	const outputPath = paths.build;

	const outputFilename = getForMode('[name].bundle.js', '[name].[chunkhash:8].bundle.js');
	const outputChunkname = getForMode('[name].chunk.js', '[name].[chunkhash:8].chunk.js');

	const commonConfig = merge(
		{
			mode: buildMode,
			entry: [isServerConfig ? paths.ssrIndex : paths.index],
			output: {
				path: path.resolve(outputPath),
				filename: `${outputMapper.js}/${outputFilename}`,
				chunkFilename: `${outputMapper.js}/${outputChunkname}`,
				publicPath: cli.proxy ? proxy.publicPath : publicPath,
				sourcePrefix: '  ',
				pathinfo: cli.debug,
			},
		},
		loadJS(cli.debug),
		loadCSS(isServerConfig),
		loadImages(config),
		loadFiles(config),
		definePlugin(createGlobals(!isServerConfig)),
		context(),
		performanceHints(),
		mergeWhen(cli.analyze, analyzeBundlePlugin),
		mergeWhen(isHot, hmrPlugin)
	);

	if (isServerConfig) {
		const webpackConfig = mergeWebpackConfig(
			merge(
				commonConfig,
				{
					name: 'server',
					target: 'node',
					output: {
						path: outputPath,
						filename: 'server.js',
						libraryTarget: 'umd',
					},
				},
				limitChunkCountPlugin()
			)
		);

		// NOTE: In the `build` script, we need to access the union config by webpack config.
		// If we didn't use `enumerable: false`, webpack would not be happy with the schema.
		Object.defineProperty(webpackConfig, 'unionConfig', {
			value: config,
			enumerable: false,
		});

		return webpackConfig;
	}

	// NOTE: here we only handle the client-side configs
	const clientConfig = () =>
		merge(
			commonConfig,
			{
				name: 'client',
				entry: isHot ? [require.resolve('webpack-hot-middleware/client')] : [],
			},
			optimization(),
			cleanPlugin(config),
			extractCSSChunksPlugin(isHot, outputMapper.css),
			manifestPlugin()
		);

	const clientDevelopmentConfig = () =>
		merge(
			clientConfig(),
			loaderOptionsPlugin(true),
			mergeWhen(generateTemplate, htmlPlugin, config, outputPath),
			{
				devtool: 'cheap-source-map',
			}
		);

	const clientProductionConfig = () =>
		merge(
			clientConfig(),
			{
				bail: true,
				devtool: sourceMaps ? 'source-map' : false,
			},
			uglifyJSPlugin(cli.verbose, config)
		);

	return mergeWebpackConfig(cli.debug ? clientDevelopmentConfig() : clientProductionConfig());
};

const getWebpackConfigPair_ = config => [
	getWebpackConfig_(config, false),
	getWebpackConfig_(config, true),
];

const buildSingle_ = () => {
	const config = getAppConfig();
	invariant(config, `Missing configuration for the app called '${cli.app}'.`);

	return [getWebpackConfigPair_(config)];
};

const buildAll_ = () => getUnionConfig().map(getWebpackConfigPair_);

/**
 * If building from root directory all modules in `union.config.js` are built.
 * If --app is set, than build just the --app.
 */
module.exports = buildingAll ? buildAll_() : buildSingle_();
