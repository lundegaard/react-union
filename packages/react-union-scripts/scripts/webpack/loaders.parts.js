const ExtractCSSChunks = require('extract-css-chunks-webpack-plugin');

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

const loadCss = include => isServerConfig => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				include,
				use: [
					...(isServerConfig ? [] : [ExtractCSSChunks.loader]),
					{
						loader: require.resolve(`css-loader${isServerConfig ? '/locals' : ''}`),
						options: {
							modules: true,
							localIdentName: '[name]__[local]--[hash:base64:5]',
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
