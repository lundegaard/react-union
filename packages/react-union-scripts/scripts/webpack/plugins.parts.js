const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const { getForMode } = require('../lib/utils');

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

const uglifyJsPlugin = verbose => ({
	optimization: {
		minimizer: [
			new UglifyWebpackPlugin({
				uglifyOptions: {
					compress: {
						warnings: verbose,
					},
					output: {
						comments: false,
						// https://github.com/facebookincubator/create-react-app/issues/2488
						ascii_only: true,
					},
				},
				sourceMap: true,
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

const extractCssChunksPlugin = (hot, path) => {
	const filename = getForMode('[name].css', '[name].[chunkhash:8].css');
	const chunkFilename = getForMode('[name].chunk.css', '[name].[chunkhash:8].chunk.css');

	return {
		plugins: [
			new ExtractCssChunks({
				hot,
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
	uglifyJsPlugin,
	cleanPlugin,
	limitChunkCountPlugin,
	extractCssChunksPlugin,
};
