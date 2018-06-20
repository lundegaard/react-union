/* eslint-disable import/no-dynamic-require */
const { keys, o, reject } = require('ramda');
const { includes } = require('ramda-extension');
const path = require('path');

const { resolveSymlink } = require('../lib/utils');

const vendorBundle = ({ vendorBlackList }) => {
	const appPkg = require(resolveSymlink(process.cwd(), './package.json'));
	const inVendorBlackList = includes(vendorBlackList);
	return {
		entry: {
			vendor: o(reject(inVendorBlackList), keys)(appPkg.dependencies),
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendor: {
						chunks: 'initial',
						name: 'vendor',
						test: 'vendor',
						enforce: true,
					},
				},
			},
		},
	};
};

const resolve = () => ({
	resolve: {
		modules: [
			path.resolve(__dirname, '../node_modules'),
			path.resolve(process.cwd(), './src'),
			path.resolve(process.cwd(), './node_modules'),
			path.resolve(process.cwd(), '../../node_modules'), // in case of monorepo
			// 'node_modules',
		],
		extensions: ['.webpack.js', '.web.js', '.js', '.json'],
	},
});

const performanceHints = {
	performance: {
		hints: false,
	},
};

const context = () => ({
	context: path.resolve(path.join(process.cwd(), './src')),
});

module.exports = {
	resolve,
	vendorBundle,
	performanceHints,
	context,
};
