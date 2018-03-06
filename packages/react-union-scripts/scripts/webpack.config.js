/* eslint-disable import/no-dynamic-require */
const webpack = require('webpack');
const invariant = require('invariant');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const R = require('ramda');

const { DEBUG, VERBOSE, PROXY, NO_HMR, ANALYZE, APP } = require('./lib/cli');
const { resolveSymlink, getUnionConfig, getAppConfig } = require('./lib/utils');

const appPkg = require(resolveSymlink(process.cwd(), './package.json'));

/** if true, we are building bundles for all of the modules in 'configs' */
const buildingAll = !APP;

console.log(`Create for PROXY: ${PROXY ? 'yes' : 'no'}`);
console.log(`Debug: ${DEBUG ? 'yes' : 'no'}`);

const GLOBALS = {
	'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
	'process.env.BABEL_ENV': DEBUG ? '"development"' : '"production"',
	'process.env.BROWSER': true,
	__DEV__: DEBUG,
};
const commonConfig = {
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
				include: [
					resolveSymlink(process.cwd(), './src'),
					// TODO: remove
					resolveSymlink(__dirname, '../../../node_modules/react-union'),
				],
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
							sourceMap: DEBUG,
						},
					},
					{
						loader: require.resolve('resolve-url-loader'),
						options: {
							sourceMap: true,
						},
					},
					{
						loader: require.resolve('sass-loader'),
						options: {
							sourceMap: DEBUG,
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
				include: [resolveSymlink(process.cwd(), './src')],
				use: [require.resolve('url-loader')],
			},
			{
				test: /\.(eot|ttf|wav|mp3|otf)$/,
				include: [resolveSymlink(process.cwd(), './src')],
				use: [require.resolve('file-loader')],
			},
		],
	},
};

const getWebpackConfig_ = ({
	buildDir,
	name: appName,
	path: appPath,
	proxy,
	generateVendorBundle,
	vendorBlackList,
}) => {
	const inVendorBlackList = R.flip(R.contains)(vendorBlackList);
	const outputPath = path.join(buildDir, '/assets/', appName);

	return {
		// base dir for the `entry`
		context: path.resolve(path.join(process.cwd(), './src')),
		entry: {
			// entry for vendor deps
			...(generateVendorBundle
				? { vendor: R.o(R.reject(inVendorBlackList), R.keys)(appPkg.dependencies) }
				: {}),
			[appName]: [
				require.resolve('babel-polyfill'),
				...(DEBUG && !NO_HMR ? ['react-hot-loader/patch', 'webpack-hot-middleware/client'] : []),
				// adds the concrete module...
				path.join(appPath, 'index'),
			],
		},
		plugins: [
			new webpack.LoaderOptionsPlugin({
				debug: DEBUG,
			}),
			new CleanWebpackPlugin([outputPath], { root: process.cwd() }),
			// these globals will be accesible within the code
			new webpack.DefinePlugin(GLOBALS),
			...(!DEBUG ? [new webpack.optimize.OccurrenceOrderPlugin()] : []),
			// for hot reloading ( eg. adds functionality through the `module.hot` in the code )
			...(DEBUG && !NO_HMR ? [new webpack.HotModuleReplacementPlugin()] : []),
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
			...(!PROXY
				? [
						new HtmlWebpackPlugin({
							title: appName,
							// relative to output folder
							filename: '../../index.html',
							template: path.resolve(process.cwd(), `./public/${appName}/index.ejs`),
						}),
					]
				: []),
			...(!DEBUG
				? [
						new webpack.optimize.UglifyJsPlugin({
							compress: {
								warnings: VERBOSE,
							},
							output: {
								comments: true,
								// https://github.com/facebookincubator/create-react-app/issues/2488
								ascii_only: true,
							},
							sourceMap: true,
						}),
						// new webpack.optimize.AggressiveMergingPlugin(),
					]
				: []),
			...(!DEBUG
				? [
						new ManifestPlugin({
							fileName: 'assetManifest.json',
						}),
					]
				: []),
			...(ANALYZE ? [new BundleAnalyzerPlugin()] : []),
		],
		output: {
			path: outputPath,
			filename: DEBUG ? '[name].bundle.js' : '[name].[chunkhash:8].bundle.js',
			chunkFilename: DEBUG ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
			publicPath: PROXY ? proxy.publicPath : `/assets/${appName}/`,
			sourcePrefix: '  ',
		},
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
		devtool: DEBUG ? 'source-map' : false,
		module: commonConfig.module,
	};
};

const buildSingle_ = () => {
	const config = getAppConfig(APP);
	invariant(config, `Missing configuration for the app called '${APP}'.`);

	return [getWebpackConfig_(config)];
};

const buildAll_ = () => getUnionConfig().map(getWebpackConfig_);

/**
 * If building from root directory all modules in `union.config.js` are built.
 * If --app is set, than build just the --app.
 */
module.exports = buildingAll ? buildAll_() : buildSingle_();
