const { resolveAsyncSuffix } = require('../lib/utils');

const loadAsyncModules = include => ({ asyncSuffix }) => ({
	module: {
		rules: [
			{
				test: resolveAsyncSuffix(asyncSuffix),
				include,
				exclude: /node_modules/,
				use: [
					require.resolve('babel-loader'),
					{
						loader: require.resolve('bundle-loader'),
						options: {
							lazy: true,
							name: '[name]',
						},
					},
				],
			},
		],
	},
});

const loadBabel = include => () => ({
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				include,
				use: [require.resolve('babel-loader')],
			},
		],
	},
});

const loadCss = include => () => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				include,
				use: [require.resolve('style-loader'), require.resolve('css-loader')],
			},
		],
	},
});

const loadImages = include => ({ outputMapper }) => ({
	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				include,
				use: [
					{
						loader: require.resolve('url-loader'),
						options: {
							name: `${outputMapper.media}/[name].[ext]`,
						},
					},
				],
			},
		],
	},
});

const loadFiles = include => ({ outputMapper }) => ({
	module: {
		rules: [
			{
				test: /\.(eot|ttf|wav|mp3|otf)$/,
				include,
				use: [
					{
						loader: require.resolve('file-loader'),
						options: {
							name: `${outputMapper.media}/[name].[ext]`,
						},
					},
				],
			},
		],
	},
});

module.exports = {
	loadAsyncModules,
	loadBabel,
	loadCss,
	loadImages,
	loadFiles,
};
