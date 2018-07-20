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

const loadScss = include => debug => ({
	module: {
		rules: [
			{
				test: /\.scss$/,
				include,
				use: [
					require.resolve('style-loader'),
					{
						loader: require.resolve('css-loader'),
						options: {
							importLoaders: 1,
							minimize: true,
							sourceMap: debug,
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
							sourceMap: debug,
						},
					},
				],
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
	loadBabel,
	loadCss,
	loadScss,
	loadImages,
	loadFiles,
};
