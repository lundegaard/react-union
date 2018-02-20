/* eslint-disable import/no-dynamic-require */
const R = require('ramda');
const { verbose } = require('./cli');
const invariant = require('invariant');
const fs = require('fs');
const path = require('path');

const cli = require('./cli');

const unionConfig = require(path.resolve(process.cwd(), './union.config')) || {};

const defaultBuildDir = path.resolve(process.cwd(), './build');
const defaultPort = 3300;

const defaultUnionConfig = {
	buildDir: defaultBuildDir,
	generateVendorBundle: true,
	vendorBlackList: [],
	publicPath: '/',
	devServer: {
		port: defaultPort,
		baseDir: defaultBuildDir,
	},
	proxy: {
		port: defaultPort,
		target: '',
		publicPath: '/',
	},
	outputMapper: {
		css: 'static/css',
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


const extendOutputMapper_ = R.evolve({
	outputMapper: R.flip(R.merge)(defaultUnionConfig.outputMapper),
});

const mergeCommonUnionConfig_ = R.o(R.mergeDeepRight(defaultUnionConfig), R.omit(['apps']));
const getCommonUnionConfig_ = R.o(extendOutputMapper_, mergeCommonUnionConfig_);

const getAppsUnionConfig_ = R.path(['apps']);

const getUnionConfig = () => {
	const evaluatedUnionConfig = R.is(Function)(unionConfig) ? unionConfig(cli) : unionConfig;

	const common = getCommonUnionConfig_(evaluatedUnionConfig);
	const apps = getAppsUnionConfig_(evaluatedUnionConfig);

	invariant(apps, "Missing property 'apps' in your union.config.js.");

	return R.map(R.mergeDeepRight(common), apps);
};

const getAppConfig = name => R.find(R.whereEq({ name }), getUnionConfig());

const resolveSymlink = (...args) => fs.realpathSync(path.resolve(...args));

const equalsSlash_ = R.equals('/');

const trimSlashes = R.o(R.dropWhile(equalsSlash_), R.dropLastWhile(equalsSlash_));

module.exports = {
	getAppConfig,
	getUnionConfig,
	resolveSymlink,
	stats,
	trimSlashes,
};
