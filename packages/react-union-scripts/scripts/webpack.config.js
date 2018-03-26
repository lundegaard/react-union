/* eslint-disable import/no-dynamic-require */
const webpack = require('webpack');
const invariant = require('invariant');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const { o, reject, keys } = require('ramda');
const { includes } = require('ramda-extension');

const cli = require('./lib/cli');
const { resolveSymlink, getUnionConfig, getAppConfig } = require('./lib/utils');

const appPkg = require(resolveSymlink(process.cwd(), './package.json'));

/** if true, we are building bundles for all of the modules in 'configs' */
const buildingAll = !cli.app;

if (cli.proxy) {
	console.log('Starting proxy.');
}

console.log(`Optimizing for ${cli.debug ? 'development' : 'production'} mode.`);

const GLOBALS = {
	__DEV__: cli.debug, //  alias for `process.env.NODE_ENV === 'development'
	'process.env.BROWSER': true,
	'process.env.BABEL_ENV': cli.debug ? '"development"' : '"production"',
	'process.env.NODE_ENV': cli.debug ? '"development"' : '"production"',
};

const getCommonConfig = ({ outputMapper }) => ({
	module: {
		rules: [
			// All widgets are loaded asynchronously
			{
				test: /\.widget\.js$/,
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
			{
				test: /\.jsx?$/,
				include: [resolveSymlink(process.cwd(), './src')],
				use: [require.resolve('babel-loader')],
			},
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
							sourceMap: cli.debug,
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
							sourceMap: cli.debug,
						},
					},
				],
			},
			{
				test: /\.css$/,
				include: [resolveSymlink(process.cwd(), './src')],
				use: [require.resolve('style-loader'), require.resolve('css-loader')],
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				include: [resolveSymlink(process.cwd(), './src'), resolveSymlink(process.cwd(), './node_modules')],
				use: [
					{
						loader: require.resolve('url-loader'),
						options: {
							name: `${outputMapper.media}/[name].[ext]`,
						},
					},
				],
			},
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

const getWebpackConfig_ = config => {
	const {
		paths,
		templateFilename,
		name: appName,
		proxy,
		generateVendorBundle,
		vendorBlackList,
		publicPath,
		outputMapper,
		mergeWebpackConfig,
	} = config;

	const commonConfig = getCommonConfig(config);

	const inVendorBlackList = includes(vendorBlackList);
	const hmr = cli.script === 'start' && cli.debug && !cli.noHmr;
	const outputPath = path.join(paths.build, publicPath);

	const outputFilename = cli.debug ? '[name].bundle.js' : '[name].[chunkhash:8].bundle.js';
	const outputChunkname = cli.debug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js';
	const template = `${paths.public}/${templateFilename}`;

	return mergeWebpackConfig({
		// base dir for the `entry`
		context: path.resolve(path.join(process.cwd(), './src')),
		entry: {
			// entry for vendor deps
			...(generateVendorBundle
				? { vendor: o(reject(inVendorBlackList), keys)(appPkg.dependencies) }
				: {}),
			[appName]: [
				require.resolve('babel-polyfill'),
				...(hmr
					? [
						require.resolve('react-hot-loader/patch'),
						require.resolve('webpack-hot-middleware/client'),
					]
					: []),
				paths.index,
			],
		},
		output: {
			path: path.resolve(outputPath),
			filename: `${outputMapper.js}/${outputFilename}`,
			chunkFilename: `${outputMapper.js}/${outputChunkname}`,
			publicPath: cli.proxy ? proxy.publicPath : publicPath,
			sourcePrefix: '  ',
		},
		plugins: [
			new webpack.LoaderOptionsPlugin({
				debug: cli.debug,
			}),
			new CleanWebpackPlugin([outputPath], { root: process.cwd() }),
			// these globals will be accesible within the code
			new webpack.DefinePlugin(GLOBALS),
			...(!cli.debug ? [new webpack.optimize.OccurrenceOrderPlugin()] : []),
			// for hot reloading ( eg. adds functionality through the `module.hot` in the code )
			...(hmr ? [new webpack.HotModuleReplacementPlugin()] : []),
			// stopping bundle when there is an error
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.optimize.CommonsChunkPlugin({
				// `name` have to be equal to the entry
				name: appName,
				// enables to split the code and asynchrounosly load the chunks
				// through `require.ensure` or `bundle-loader`
				async: true,
				children: true,
				minSize: 0,
				minChunks: 2,
			}),
			// `vendors` to standalone chunk
			...(generateVendorBundle
				? [
					new webpack.optimize.CommonsChunkPlugin({
						name: 'vendor',
						minChunks: Infinity,
					}),
				]
				: []),
			// Create HTML file for development without proxy
			...(!cli.proxy
				? [
					new HtmlWebpackPlugin({
						title: appName,
						filename: path.resolve(outputPath, outputMapper.index),
						template,
					}),
				]
				: []),
			...(!cli.debug
				? [
					new webpack.optimize.UglifyJsPlugin({
						compress: {
							warnings: cli.verbose,
						},
						output: {
							comments: false,
							// https://github.com/facebookincubator/create-react-app/issues/2488
							ascii_only: true,
						},
						sourceMap: true,
					}),
					// new webpack.optimize.AggressiveMergingPlugin(),
				]
				: []),
			...(!cli.debug
				? [
					new ManifestPlugin({
						fileName: 'assetManifest.json',
					}),
				]
				: []),
			...(cli.analyze ? [new BundleAnalyzerPlugin()] : []),
		],
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
		devtool: cli.debug ? 'source-map' : false,
		module: commonConfig.module,
	});
};

const buildSingle_ = () => {
	const config = getAppConfig(cli.app);
	invariant(config, `Missing configuration for the app called '${cli.app}'.`);

	return [getWebpackConfig_(config)];
};

const buildAll_ = () => getUnionConfig().map(getWebpackConfig_);

/**
 * If building from root directory all modules in `union.config.js` are built.
 * If --app is set, than build just the --app.
 */
module.exports = buildingAll ? buildAll_() : buildSingle_();
