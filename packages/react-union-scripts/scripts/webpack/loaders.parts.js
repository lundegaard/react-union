const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

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

const loadCss = include => (sourceMap, isServerConfig) => ({
	module: {
		rules: [
			{
				test: /\.s?css$/,
				include,
				use: [
					...(isServerConfig ? [] : [ExtractCssChunks.loader]),
					{
						loader: require.resolve(`css-loader${isServerConfig ? '/locals' : ''}`),
						options: {
							importLoaders: 2,
							minimize: true,
							sourceMap,
							modules: true,
							localIdentName: '[name]__[local]--[hash:base64:5]',
						},
					},
					{
						loader: require.resolve('resolve-url-loader'),
						options: {
							// always true - needed for sass-loader
							sourceMap: true,
						},
					},
					{
						loader: require.resolve('sass-loader'),
						options: {
							sourceMap,
						},
					},
				],
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
	loadBabel,
	loadCss,
	loadImages,
	loadFiles,
};
