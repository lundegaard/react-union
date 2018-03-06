/* eslint-disable import/no-dynamic-require */
const R = require('ramda');
const { verbose } = require('./cli');
const invariant = require('invariant');
const fs = require('fs');
const path = require('path');

const cli = require('./cli');

const unionConfig = require(path.resolve(process.cwd(), './union.config')) || {};

const defaultPort = 3300;

const defaultUnionConfig = {
	paths: {},
	generateVendorBundle: true,
	vendorBlackList: [],
	publicPath: '/',
	templateFilename: 'index.ejs',
	devServer: {
		port: defaultPort,
	},
	proxy: {
		port: defaultPort,
		target: '',
		publicPath: '/',
	},
	outputMapper: {
		js: 'static/js',
		media: 'static/media',
		index: 'index.html',
	},
};

const stats = {
	colors: true,
	chunks: verbose,
	reasons: verbose,
	hash: verbose,
	version: verbose,
	timings: true,
	chunkModules: verbose,
	cached: verbose,
	cachedAssets: verbose,
};

const equalsSlash_ = R.equals('/');
const trimSlashes = R.o(R.dropWhile(equalsSlash_), R.dropLastWhile(equalsSlash_));

const getApps_ = R.path(['apps']);

const computePaths_ = config => ({
	...config,
	paths: {
		// path to build folder
		build: path.resolve(process.cwd(), 'build', config.name),
		// directory for resources and template
		public: path.resolve(process.cwd(), 'public', config.name),
		// path entry of the app
		index: path.resolve(process.cwd(), 'src', 'apps', config.name, 'index'),
		...config.paths,
	},
});

const extendOutputMapper_ = R.evolve({
	outputMapper: R.o(R.map(trimSlashes), R.merge(defaultUnionConfig.outputMapper)),
});

const getCommonUnionConfig_ = R.o(R.mergeDeepRight(defaultUnionConfig), R.omit(['apps']));

const getAppConfig_ = R.o(computePaths_, extendOutputMapper_);

const mergeAppAndCommonConfig_ = common => R.o(getAppConfig_, R.mergeDeepRight(common));

const validateRawConfig_ = ({ apps }) => {
	invariant(apps, "Missing property 'apps' in your union.config.js.");

	R.forEach(({ name }) => {
		invariant(name, "Property 'name' is not specified for one of the apps.");
	})(apps);
};

const getUnionConfig = () => {
	const evaluatedUnionConfig = R.is(Function)(unionConfig) ? unionConfig(cli) : unionConfig;

	validateRawConfig_(evaluatedUnionConfig);

	const common = getCommonUnionConfig_(evaluatedUnionConfig);
	const apps = getApps_(evaluatedUnionConfig);

	return R.map(mergeAppAndCommonConfig_(common), apps);
};

const getAppConfig = name => R.find(R.whereEq({ name }), getUnionConfig());

const resolveSymlink = (...args) => fs.realpathSync(path.resolve(...args));

module.exports = {
	getAppConfig,
	getUnionConfig,
	resolveSymlink,
	stats,
	trimSlashes,
};
