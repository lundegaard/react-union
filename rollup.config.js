import replacePlugin from 'rollup-plugin-replace';
import autoExternalPlugin from 'rollup-plugin-auto-external';
import cjsPlugin from 'rollup-plugin-commonjs';
import { terser as terserPlugin } from 'rollup-plugin-terser';
import babelPlugin from 'rollup-plugin-babel';

import path from 'path';
import { toPascalCase, toKebabCase } from 'ramda-extension';

const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH } = process.env;

const plugins = {
	autoExternal: autoExternalPlugin(),
	cjs: cjsPlugin({
		include: /node_modules/,
	}),
	terser: terserPlugin({
		compress: {
			pure_getters: true,
			unsafe: true,
			unsafe_comps: true,
			warnings: false,
		},
	}),
	babel: babelPlugin({
		cwd: LERNA_ROOT_PATH,
		exclude: 'node_modules/**',
		runtimeHelpers: true,
		externalHelpers: true,
	}),
};

const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, 'src/index.js');

const globals = {
	'hoist-non-react-statics': 'HoistNonReactStatics',
	'prop-types': 'PropTypes',
	ramda: 'R',
	'ramda-extension': 'R_',
	react: 'React',
	'react-dom': 'ReactDOM',
	'react-union': 'ReactUnion',
};

const globalName = toPascalCase(LERNA_PACKAGE_NAME);
const fileName = toKebabCase(LERNA_PACKAGE_NAME);

export default [
	// CJS
	{
		input: INPUT_FILE,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'lib', `${fileName}.js`),
			format: 'cjs',
			indent: false,
		},
		plugins: [plugins.babel, plugins.cjs, plugins.autoExternal],
	},

	// ES
	{
		input: INPUT_FILE,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'es', `${fileName}.js`),
			format: 'es',
			indent: false,
		},
		plugins: [plugins.babel, plugins.cjs, plugins.autoExternal],
	},

	// UMD Development
	{
		input: INPUT_FILE,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'dist', `${fileName}.js`),
			format: 'umd',
			name: globalName,
			indent: false,
			globals,
		},
		plugins: [
			replacePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
			plugins.babel,
			plugins.cjs,
			plugins.autoExternal,
		],
	},

	// UMD Production
	{
		input: INPUT_FILE,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'dist', `${fileName}.min.js`),
			format: 'umd',
			name: globalName,
			indent: false,
			globals,
		},
		plugins: [
			replacePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
			plugins.babel,
			plugins.cjs,
			plugins.autoExternal,
			plugins.terser,
		],
	},
];
