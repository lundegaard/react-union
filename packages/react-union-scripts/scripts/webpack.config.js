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
	readPackagesJSONOnPathsTransducer,
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
} = require('./webpack/plugins.parts');
const { resolve, vendorBundle, performanceHints, context } = require('./webpack/common.parts');

const dependenciesP = R.prop('dependencies');

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
		sourceMaps,
	} = config;

	const getPackagesPathForSuffix = getPackagesPath(config);

	const hmr = cli.script === 'start' && cli.debug && !cli.noHmr;

	const outputPath = paths.build;

	const outputFilename = getForMode('[name].bundle.js', '[name].[chunkhash:8].bundle.js');
	const outputChunkname = getForMode('[name].chunk.js', '[name].[chunkhash:8].chunk.js');

	const loadersForUniRepo = () => [resolveSymlink(process.cwd(), './src')];

	const loadersForMonoRepo = () => getPackagesPathForSuffix('src');

	const { loadAsyncModules, loadBabel, loadCss, loadImages, loadFiles } = addPathsToLoaders(
		isMonoRepo ? loadersForMonoRepo() : loadersForUniRepo()
	);

	const uniRepoDeps = () => require(resolveSymlink(process.cwd(), './package.json')).dependencies;
	// TODO consider only adding deps that are intersect across the widgets and apps
	const monoRepoDeps = () =>
		R.pipe(
			R.into(
				[],
				R.compose(
					R.filter(R.either(R.contains(appName), getUsedPackagesForApp(config))),
					readPackagesJSONOnPathsTransducer,
					R.map(dependenciesP)
				)
			),
			R.mergeAll
		)(getAllWorkspacesWithFullPathSuffixed('package.json'));

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
		loadAsyncModules(config),
		loadBabel(),
		loadCss(),
		loadImages(config),
		loadFiles(config),
		definePlugin(GLOBALS),
		cleanPlugin(config),
		resolve(isMonoRepo ? monoRepoResolve() : uniRepoResolve()),
		context(),
		performanceHints,
		mergeWhen(cli.analyze, analyzeBundlePlugin),
		mergeWhen(
			generateVendorBundle,
			vendorBundle,
			config,
			isMonoRepo ? monoRepoDeps() : uniRepoDeps()
		),
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
