const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

const loaderOptionsPlugin = debug => ({
	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug,
		}),
	],
});

const cleanPlugin = ({ clean: { paths, options } = {} }) => ({
	plugins: [new CleanWebpackPlugin(paths, options)],
});

const definePlugin = globals => ({
	plugins: [new webpack.DefinePlugin(globals)],
});

const hmrPlugin = () => ({
	plugins: [new webpack.HotModuleReplacementPlugin()],
});

const htmlPlugin = ({ appName, outputMapper, paths, templateFilename }, outputPath) => ({
	plugins: [
		new HtmlWebpackPlugin({
			title: appName,
			filename: path.resolve(outputPath, outputMapper.index),
			template: `${paths.public}/${templateFilename}`,
		}),
	],
});

const manifestPlugin = () => ({
	plugins: [
		new ManifestPlugin({
			fileName: 'assetManifest.json',
		}),
	],
});

const analyzeBundlePlugin = () => ({
	plugins: [new BundleAnalyzerPlugin()],
});

const uglifyJsPlugin = (verbose, { sourceMaps, uglifyOptions: { cache, parallel, mangle } }) => ({
	optimization: {
		minimizer: [
			new UglifyWebpackPlugin({
				cache,
				parallel,
				sourceMap: sourceMaps,
				uglifyOptions: {
					mangle,
					warnings: verbose,
					compress: {
						comparisons: false,
						warnings: verbose,
					},
					output: {
						comments: verbose,
						ascii_only: true,
					},
				},
			}),
		],
	},
});

module.exports = {
	loaderOptionsPlugin,
	definePlugin,
	htmlPlugin,
	hmrPlugin,
	manifestPlugin,
	analyzeBundlePlugin,
	uglifyJsPlugin,
	cleanPlugin,
};
