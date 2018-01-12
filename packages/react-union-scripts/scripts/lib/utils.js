/* eslint-disable import/no-dynamic-require */
const R = require('ramda');
const { VERBOSE } = require('./cli');
const invariant = require('invariant');
const fs = require('fs');
const path = require('path');

const unionConfig = require(path.resolve(process.cwd(), './union.config')) || {};

const defaultBuildDir = path.resolve(process.cwd(), './build/public');
const defaultPort = 3300;

const defaultUnionConfig = {
	buildDir: defaultBuildDir,
	generateVendorBundle: true,
	vendorBlackList: [],
	devServer: {
		port: defaultPort,
		baseDir: defaultBuildDir,
	},
	proxy: {
		port: defaultPort,
		target: '',
		publicPath: '/',
	},
};

const getCommonUnionConfig = R.o(R.mergeDeepRight(defaultUnionConfig), R.omit(['apps']));
const getAppsUnionConfig = R.path(['apps']);

const getUnionConfig = () => {
	const common = getCommonUnionConfig(unionConfig);
	const apps = getAppsUnionConfig(unionConfig);

	invariant(apps, "Missing property 'apps' in your union.config.js.");

	return R.map(R.mergeDeepRight(common), apps);
};

const getAppConfig = name => R.find(R.whereEq({ name }), getUnionConfig());
const resolveSymlink = (...args) => fs.realpathSync(path.resolve(...args));

module.exports.getAppConfig = getAppConfig;
module.exports.getUnionConfig = getUnionConfig;
module.exports.resolveSymlink = resolveSymlink;

module.exports.stats = {
	colors: true,
	chunks: VERBOSE,
	reasons: VERBOSE,
	hash: VERBOSE,
	version: VERBOSE,
	timings: true,
	chunkModules: VERBOSE,
	cached: VERBOSE,
	cachedAssets: VERBOSE,
};
