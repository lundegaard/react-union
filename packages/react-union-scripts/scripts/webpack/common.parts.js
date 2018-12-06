const path = require('path');

const optimization = () => ({
	optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~',
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'initial',
				},
			},
		},
		// Keep the runtime chunk seperated to enable long term caching
		// https://twitter.com/wSokra/status/969679223278505985
		runtimeChunk: {
			name: 'runtime',
		},
	},
});

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
	optimization,
	performanceHints,
	context,
};
