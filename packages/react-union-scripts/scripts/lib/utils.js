/* eslint-disable import/no-dynamic-require */
const R = require('ramda');
const R_ = require('ramda-extension');
const invariant = require('invariant');
const fs = require('fs');
const path = require('path');

const utilsFs = require('./fs');
const cli = require('./cli');

const isMonoRepo = utilsFs.getWorkspacesPatterns();

const DEFAULT_WIDGET_PATTERN = 'union-widget';
const DEFAULT_APP_PATTERN = 'union-app';

const BUILD_FOLDER = 'build';
const PUBLIC_FOLDER = 'public';
const SRC_FOLDER = 'src';
const INDEX_FOLDER = 'index';
const APPS_FOLDER = 'apps';

const UNION_CONFIG_PATH = path.resolve(process.cwd(), './union.config.js');
const DEFAULT_UNI_REPO_APP_DIR = path.resolve(process.cwd(), SRC_FOLDER, APPS_FOLDER);

const DEFAULT_PORT = 3300;
const DEFAULT_UNION_CONFIG = {
	// computed in `extendPaths_`
	paths: {},
	// computed in `extendsClean_`
	clean: { options: {} },
	generateVendorBundle: true,
	generateTemplate: true,
	vendorBlackList: [],
	publicPath: '/',
	templateFilename: 'index.ejs',
	copyToPublicIgnore: /\.ejs$/,
	devServer: {
		historyApiFallback: true,
		port: DEFAULT_PORT,
	},
	proxy: {
		port: DEFAULT_PORT,
		target: '',
		publicPath: '/',
	},
	outputMapper: {
		js: 'static/js',
		media: 'static/media',
		index: 'index.html',
	},
	mergeWebpackConfig: R.identity,
	asyncSuffix: 'widget',
	workspaces: {
		widgetPattern: DEFAULT_WIDGET_PATTERN,
		appPattern: DEFAULT_APP_PATTERN,
	},
	sourceMaps: false,
	uglifyOptions: { parallel: true, cache: true, mangle: false },
};

const stats = {
	colors: true,
	chunks: cli.verbose,
	reasons: cli.verbose,
	hash: cli.verbose,
	version: cli.verbose,
	timings: true,
	chunkModules: cli.verbose,
	cached: cli.verbose,
	cachedAssets: cli.verbose,
};

const equalsSlash_ = R.equals('/');
const nilOrEmpty_ = R.either(R.isNil, R.isEmpty);
const whenIsFunction_ = R.when(R_.isFunction);
const trimSlashes = R.o(R.dropWhile(equalsSlash_), R.dropLastWhile(equalsSlash_));

const getApps_ = R.path([APPS_FOLDER]);

const extendsClean_ = config => ({
	...config,
	clean: {
		paths: [config.paths.build],
		...config.clean,
		options: {
			root: process.cwd(),
			...config.clean.options,
		},
	},
});

const defaultUniRepoPaths = config => ({
	build: path.resolve(process.cwd(), BUILD_FOLDER, config.name),
	// directory for resources and template
	public: path.resolve(process.cwd(), PUBLIC_FOLDER, config.name),
	// path entry of the app
	index: path.resolve(DEFAULT_UNI_REPO_APP_DIR, config.name, INDEX_FOLDER),
});

const defaultMonoRepoPaths = config => {
	const appPath = utilsFs.getAppPath(config.name);
	return {
		build: path.resolve(process.cwd(), BUILD_FOLDER, config.name),
		public: path.resolve(process.cwd(), appPath, PUBLIC_FOLDER),
		index: path.resolve(process.cwd(), appPath, SRC_FOLDER, INDEX_FOLDER),
	};
};

const extendPaths_ = config => ({
	...config,
	paths: {
		...(isMonoRepo ? defaultMonoRepoPaths(config) : defaultUniRepoPaths(config)),
		...config.paths,
	},
});

const extendOutputMapper_ = R.evolve({
	outputMapper: R.o(R.map(trimSlashes), R.merge(DEFAULT_UNION_CONFIG.outputMapper)),
});

const getCommonUnionConfig_ = R.omit([APPS_FOLDER]);

const extendConfigs = R.map(
	R.o(
		R.compose(
			extendsClean_,
			extendPaths_,
			extendOutputMapper_
		),
		R.mergeDeepRight(DEFAULT_UNION_CONFIG)
	)
);

const validateConfig_ = R.forEach(({ name }) => {
	invariant(name, "Property 'name' is not specified for one of the apps.");
});

const fromArrayConfig_ = R.map(R.when(R_.isString, name => ({ name })));
const fromObjectConfig_ = R.compose(
	R.unless(R.isNil, config => {
		const common = getCommonUnionConfig_(config);
		const apps = R.o(R.defaultTo({}), getApps_)(config);

		return R.map(R.mergeDeepRight(common), apps);
	}),
	R.evolve({ apps: fromArrayConfig_ })
);

/**
 * Converts the passed config to normalized shape.
 *
 * @example
 *
 * 		normalizeConfig(["app", { name: "app2" }]) // [{ name: "app" }, { name: "app2" }]
 *
 * 		normalizeConfig({ templateFilename: 'index.ejs', apps: ["app"]})
 * 		// [{ name: "app", templateFilename: 'index.ejs', }]
 *
 * @see tests
 */
const normalizeConfig = R.cond([
	[R_.isArray, fromArrayConfig_],
	[R_.isObject, fromObjectConfig_],
	[R.T, R_.noop],
]);

const getAppPattern_ = R.path(['workspaces', 'appPattern']);

const setAppsIfMissing_ = config => {
	const uniRepoDirs = () => utilsFs.readDirs(DEFAULT_UNI_REPO_APP_DIR);
	const appsPattern = getAppPattern_(config) || getAppPattern_(DEFAULT_UNION_CONFIG);
	const appDirs = isMonoRepo ? utilsFs.readAllAppsFromWorkspaces(appsPattern) : uniRepoDirs();
	return R.cond([
		[nilOrEmpty_, R.always(appDirs)],
		[R_.isArray, R.identity],
		[c => !c.apps, c => R.mergeDeepRight(c, { apps: appDirs })],
		[R.T, R.identity],
	])(config);
};

/**
 * Returns evaluated unionConfig based on `union.config.js`.
 *
 * If no config is found or is empty,
 * try to scan names of directories from default unionConfig.paths.app location.
 *
 */
const getUnionConfig = () =>
	R.pipe(
		R.ifElse(fs.existsSync, x => require(x), R_.noop),
		whenIsFunction_(R.applyTo(cli)),
		setAppsIfMissing_,
		normalizeConfig,
		R.tap(validateConfig_),
		extendConfigs
	)(UNION_CONFIG_PATH);

/**
 * Return unionConfig for the `app`.
 *
 * @param {string} app Name of the app
 */
const getAppConfig = () =>
	R.find(R.whereEq({ name: isMonoRepo ? cli.appOriginal : cli.app }), getUnionConfig());

const resolveAsyncSuffix = R.cond([
	[R.is(RegExp), R.identity],
	[R_.isString, asyncSuffix => R_.constructRegExp(`\.${asyncSuffix}\.js$`, 'i')],
	[R_.isArray, asyncSuffix => R_.constructRegExp(`\.(${R.join('|', asyncSuffix)})\.js$`, 'i')],
	[
		R.T,
		() =>
			invariant(false, "Invalid property 'asyncSuffix'. It should be string or list of strings."),
	],
]);

const mergeWhen = (condition, fn, ...fnArgs) => (condition ? fn(...fnArgs) : {});
const getForMode = (debug, prod) => (cli.debug ? debug : prod);

module.exports = {
	UNION_CONFIG_PATH,
	normalizeConfig,
	getUnionConfig,
	getAppConfig,
	resolveAsyncSuffix,
	stats,
	isMonoRepo,
	mergeWhen,
	getForMode,
};
