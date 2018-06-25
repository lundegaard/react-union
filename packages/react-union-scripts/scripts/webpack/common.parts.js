/* eslint-disable import/no-dynamic-require */
const { keys, o, reject } = require('ramda');
const { includes } = require('ramda-extension');
const path = require('path');

const vendorBundle = ({ vendorBlackList }, dependencies) => {
	const inVendorBlackList = includes(vendorBlackList);
	return {
		entry: {
			vendor: o(reject(inVendorBlackList), keys)(dependencies),
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

const resolve = modules => ({
	resolve: {
		modules,
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
