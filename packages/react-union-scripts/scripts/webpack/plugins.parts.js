const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const ExtractCSSChunks = require('extract-css-chunks-webpack-plugin');
const { getForMode } = require('../lib/utils');

const loaderOptionsPlugin = debug => ({
	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug,
		}),
	],
});

const cleanPlugin = () => ({
	plugins: [new CleanWebpackPlugin()],
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

const uglifyJSPlugin = (verbose, { sourceMaps, uglifyOptions: { cache, parallel, mangle } }) => ({
	optimization: {
		minimizer: [
			new UglifyWebpackPlugin({
				cache,
				parallel,
				sourceMap: Boolean(sourceMaps),
				uglifyOptions: {
					mangle,
					warnings: verbose,
					compress: {
						comparisons: false,
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

const limitChunkCountPlugin = () => ({
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
	],
});

const extractCSSChunksPlugin = (hot, path) => {
	const filename = getForMode('[name].css', '[name].[chunkhash:8].css');
	const chunkFilename = getForMode('[name].chunk.css', '[name].[chunkhash:8].chunk.css');

	return {
		plugins: [
			new ExtractCSSChunks({
				hot,
				cssModules: true,
				filename: `${path}/${filename}`,
				chunkFilename: `${path}/${chunkFilename}`,
			}),
		],
	};
};

module.exports = {
	loaderOptionsPlugin,
	definePlugin,
	htmlPlugin,
	hmrPlugin,
	manifestPlugin,
	analyzeBundlePlugin,
	uglifyJSPlugin,
	cleanPlugin,
	limitChunkCountPlugin,
	extractCSSChunksPlugin,
};
