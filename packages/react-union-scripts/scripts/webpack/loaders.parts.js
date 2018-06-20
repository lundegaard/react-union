const { resolveSymlink, resolveAsyncSuffix } = require('../lib/utils');

const loadAsyncModules = ({ asyncSuffix }) => ({
	module: {
		rules: [
			{
				test: resolveAsyncSuffix(asyncSuffix),
				include: [resolveSymlink(process.cwd(), './src')],
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

const loadBabel = () => ({
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				include: [resolveSymlink(process.cwd(), './src')],
				use: [require.resolve('babel-loader')],
			},
		],
	},
});

const loadScss = debug => ({
	module: {
		rules: [
			{
				test: /\.scss$/,
				include: [resolveSymlink(process.cwd(), './src')],
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

const loadCss = () => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				include: [resolveSymlink(process.cwd(), './src')],
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
				include: [
					resolveSymlink(process.cwd(), './src'),
					resolveSymlink(process.cwd(), './node_modules'),
				],
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
				include: [resolveSymlink(process.cwd(), './src')],
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
	loadScss,
	loadImages,
	loadFiles,
};
