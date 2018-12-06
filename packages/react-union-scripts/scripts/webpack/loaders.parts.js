const loadJS = () => ({
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [require.resolve('babel-loader')],
			},
		],
	},
});

const loadCSS = () => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [require.resolve('style-loader'), require.resolve('css-loader')],
			},
		],
	},
});

const loadImages = ({ outputMapper }) => ({
	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
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

const loadFiles = ({ outputMapper }) => ({
	module: {
		rules: [
			{
				test: /\.(eot|ttf|wav|mp3|otf)$/,
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
	loadJS,
	loadCSS,
	loadImages,
	loadFiles,
};
