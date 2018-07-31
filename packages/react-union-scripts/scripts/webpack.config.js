/* eslint-disable import/no-dynamic-require */
const invariant = require('invariant');
const merge = require('webpack-merge');
const path = require('path');
const R = require('ramda');
const R_ = require('ramda-extension');

const cli = require('./lib/cli');
const { getUnionConfig, getAppConfig, mergeWhen, getForMode, isMonoRepo } = require('./lib/utils');
const {
	resolveSymlink,
	getAllWorkspacesWithFullPathSuffixed,
	getAppPackageJSON,
	resolveWorkspacesPackagePattern,
	readAllNonUnionPackages,
} = require('./lib/fs');
const loaders = require('./webpack/loaders.parts');
const {
	loaderOptionsPlugin,
	definePlugin,
	htmlPlugin,
	hmrPlugin,
	manifestPlugin,
	analyzeBundlePlugin,
	uglifyJsPlugin,
	cleanPlugin,
	limitChunkCountPlugin,
} = require('./webpack/plugins.parts');
const { resolve, optimization, performanceHints, context } = require('./webpack/common.parts');

const dependenciesP = R.prop('dependencies');

const buildMode = getForMode('development', 'production');
const buildModeString = getForMode('"development"', '"production"');

/** if true, we are building bundles for all of the modules in 'configs' */
const buildingAll = !cli.app;

if (cli.proxy) {
	console.log('Starting proxy.');
}

console.log(`Optimizing for ${buildMode} mode.`);

const createGlobals = ssr => ({
	__DEV__: cli.debug, //  alias for `process.env.NODE_ENV === 'development'
	'process.env.BROWSER': ssr,
	'process.env.BABEL_ENV': buildModeString,
	'process.env.NODE_ENV': buildModeString,
	...(ssr
		? {
				window: {},
				document: {},
		  }
		: {}),
});

const nodeModulesPath = resolveSymlink(process.cwd(), './node_modules');
const isNotJsLoader = R_.notInclude([loaders.loadBabel, loaders.loadAsyncModules]);
const addPathsToLoaders = srcs =>
	R.map(value => (isNotJsLoader(value) ? value([...srcs, nodeModulesPath]) : value(srcs)), loaders);

const appsWidgetList = ({ name: appName, workspaces: { widgetPattern } }) => {
	return R.pipe(
		dependenciesP,
		R.keys,
		R.filter(R.test(resolveWorkspacesPackagePattern(widgetPattern)))
	)(getAppPackageJSON(appName));
};

const getUsedPackagesForApp = config => {
	const widgetList = appsWidgetList(config);
	// TODO maybe filter all non union packages by package.json from all of the widgets and apps.
	const allNonUnionPackages = readAllNonUnionPackages(
		config.workspaces.appPattern,
		config.workspaces.widgetPattern
	);
	const withApp = [config.name, ...widgetList, ...allNonUnionPackages];
	return pkg => R.find(R.contains(R.__, pkg), withApp);
};

const getPackagesPath = R.useWith(R.filter, [
	getUsedPackagesForApp,
	getAllWorkspacesWithFullPathSuffixed,
]);

const getWebpackConfig_ = (config, ssr) => {
	const {
		paths,
		name: appName,
		proxy,
		generateTemplate,
		publicPath,
		outputMapper,
		mergeWebpackConfig,
	} = config;

	// TODO: maybe early return if SSR index file does not exist

	const getPackagesPathForSuffix = getPackagesPath(config);

	const hmr = cli.script === 'start' && cli.debug && !cli.noHmr;

	const outputPath = paths.build;

	const outputFilename = getForMode('[name].bundle.js', '[name].[chunkhash:8].bundle.js');
	const outputChunkname = getForMode('[name].chunk.js', '[name].[chunkhash:8].chunk.js');

	const loadersForUniRepo = () => [resolveSymlink(process.cwd(), './src')];

	const loadersForMonoRepo = () => getPackagesPathForSuffix('src');

	// eslint-disable-next-line no-unused-vars
	const { loadBabel, loadCss, loadScss, loadImages, loadFiles } = addPathsToLoaders(
		isMonoRepo ? loadersForMonoRepo() : loadersForUniRepo()
	);

	const uniRepoResolve = () => [
		path.resolve(__dirname, '../node_modules'),
		path.resolve(process.cwd(), './src'),
		path.resolve(process.cwd(), './node_modules'),
		path.resolve(process.cwd(), '../../node_modules'),
	];

	const monoRepoResolve = () => [
		path.resolve(process.cwd(), './node_modules'),
		...getPackagesPathForSuffix('src'),
		...getPackagesPathForSuffix('node_modules'),
	];

	const commonConfig = merge(
		{ mode: buildMode },
		{
			entry: [
				...(ssr ? [] : [require.resolve('babel-polyfill')]),
				...(hmr ? [require.resolve('webpack-hot-middleware/client')] : []),
				...(ssr ? [paths.ssrIndex] : [paths.index]),
			],
			output: {
				path: path.resolve(outputPath),
				filename: `${outputMapper.js}/${outputFilename}`,
				chunkFilename: `${outputMapper.js}/${outputChunkname}`,
				publicPath: cli.proxy ? proxy.publicPath : publicPath,
				sourcePrefix: '  ',
				pathinfo: cli.debug,
			},
		},
		loadBabel(),
		// loadCss(),
		// loadScss(cli.debug),
		loadImages(config),
		loadFiles(config),
		definePlugin(createGlobals(ssr)),
		resolve(isMonoRepo ? monoRepoResolve() : uniRepoResolve()),
		context(),
		performanceHints(),
		mergeWhen(cli.analyze, analyzeBundlePlugin),
		manifestPlugin()
	);

	const serverWebpack = () =>
		merge(
			commonConfig,
			{
				target: 'node',
				output: {
					path: path.join(path.resolve(outputPath), '.ssr'),
					filename: `${appName}.js`,
					libraryTarget: 'umd',
				},
			},
			limitChunkCountPlugin()
		);

	const clientWebpack = () => merge(commonConfig, cleanPlugin(config), optimization());

	const devWebpack = () =>
		merge(
			clientWebpack(),
			loaderOptionsPlugin(true),
			mergeWhen(hmr, hmrPlugin),
			mergeWhen(generateTemplate, htmlPlugin, config, outputPath),
			{
				devtool: 'source-map',
			}
		);

	const prodWebpack = () => merge(clientWebpack(), uglifyJsPlugin(cli.verbose));

	if (ssr) {
		return mergeWebpackConfig(serverWebpack(), ssr);
	}

	const webpackConfig = cli.debug ? devWebpack() : prodWebpack();
	return mergeWebpackConfig(webpackConfig, ssr);
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
