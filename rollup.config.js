import replace from 'rollup-plugin-replace';
import cjsPlugin from 'rollup-plugin-commonjs';
import { terser as terserPlugin } from 'rollup-plugin-terser';
import nodeResolvePlugin from 'rollup-plugin-node-resolve';
import babelPlugin from 'rollup-plugin-babel';

import path from 'path';
import { toPascalCase, toKebabCase } from 'ramda-extension';
import { keys } from 'ramda';

const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH } = process.env;

const plugins = {
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
	nodeResolve: nodeResolvePlugin(),
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

// NOTE: We are not using `rollup-plugin-auto-external` because it includes `@babel/runtime`
// source code in the library (instead of including an import to process when building an app).
const external = id => keys(globals).includes(id) || id.includes('@babel/runtime');
const globalName = toPascalCase(LERNA_PACKAGE_NAME);
const fileName = toKebabCase(LERNA_PACKAGE_NAME);

export default [
	// CJS
	{
		input: INPUT_FILE,
		external,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'lib', `${fileName}.js`),
			format: 'cjs',
			indent: false,
		},
		plugins: [plugins.nodeResolve, plugins.babel, plugins.cjs],
	},

	// ES
	{
		input: INPUT_FILE,
		external,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'es', `${fileName}.js`),
			format: 'es',
			indent: false,
		},
		plugins: [plugins.nodeResolve, plugins.babel, plugins.cjs],
	},

	// UMD Development
	{
		input: INPUT_FILE,
		external,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'dist', `${fileName}.js`),
			format: 'umd',
			name: globalName,
			indent: false,
			globals,
		},
		plugins: [
			replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
			plugins.nodeResolve,
			plugins.babel,
			plugins.cjs,
		],
	},

	// UMD Production
	{
		input: INPUT_FILE,
		external,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'dist', `${fileName}.min.js`),
			format: 'umd',
			name: globalName,
			indent: false,
			globals,
		},
		plugins: [
			replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
			plugins.nodeResolve,
			plugins.babel,
			plugins.cjs,
			plugins.terser,
		],
	},
];
