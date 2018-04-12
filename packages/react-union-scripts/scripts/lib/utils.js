/* eslint-disable import/no-dynamic-require */
const R = require('ramda');
const R_ = require('ramda-extension');
const invariant = require('invariant');
const fs = require('fs');
const path = require('path');

const utilsFs = require('./fs');
const cli = require('./cli');

const UNION_CONFIG_PATH = path.resolve(process.cwd(), './union.config.js');
const DEFAULT_APP_DIR = path.resolve(process.cwd(), 'src', 'apps');
const DEFAULT_PORT = 3300;
const DEFAULT_UNION_CONFIG = {
	paths: {},
	generateVendorBundle: true,
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

const getApps_ = R.path(['apps']);

const extendPaths_ = config => ({
	...config,
	paths: {
		// path to build folder
		build: path.resolve(process.cwd(), 'build', config.name),
		// directory for resources and template
		public: path.resolve(process.cwd(), 'public', config.name),
		// path entry of the app
		index: path.resolve(DEFAULT_APP_DIR, config.name, 'index'),
		...config.paths,
	},
});

const extendOutputMapper_ = R.evolve({
	outputMapper: R.o(R.map(trimSlashes), R.merge(DEFAULT_UNION_CONFIG.outputMapper)),
});

const getCommonUnionConfig_ = R.omit(['apps']);

const extendConfigs = R.map(
	R.o(R.o(extendPaths_, extendOutputMapper_), R.mergeDeepRight(DEFAULT_UNION_CONFIG))
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

const setAppsIfMissing_ = R.curry((defaultDirs, config) =>
	R.cond([
		[nilOrEmpty_, R.always(defaultDirs)],
		[R_.isArray, R.identity],
		[c => !c.apps, c => R.mergeDeepRight(c, { apps: defaultDirs })],
		[R.T, R.identity],
	])(config)
);

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
		setAppsIfMissing_(utilsFs.readDirs(DEFAULT_APP_DIR)),
		normalizeConfig,
		R.tap(validateConfig_),
		extendConfigs
	)(UNION_CONFIG_PATH);

/**
 * Return unionConfig for the `app`.
 *
 * @param {string} app Name of the app
 */
const getAppConfig = name => R.find(R.whereEq({ name }), getUnionConfig());

const resolveSymlink = (...args) => fs.realpathSync(path.resolve(...args));

const resolveAsyncSuffix = R.cond([
	[R.is(RegExp), R.identity],
	[R_.isString, (asyncSuffix) => R_.constructRegExp(`\.${asyncSuffix}\.js$`, 'i')],
	[R_.isArray, (asyncSuffix) => R_.constructRegExp(`\.(${R.join('|', asyncSuffix)})\.js$`, 'i')],
	[R.T, () => invariant(false, 'Invalid property \'asyncSuffix\'. It should be string or list of strings.')],
]);


module.exports = {
	UNION_CONFIG_PATH,
	normalizeConfig,
	getUnionConfig,
	getAppConfig,
	resolveAsyncSuffix,
	resolveSymlink,
	stats,
};
