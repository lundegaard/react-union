import replacePlugin from 'rollup-plugin-replace';
import nodeResolvePlugin from 'rollup-plugin-node-resolve';
import cjsPlugin from 'rollup-plugin-commonjs';
import { terser as terserPlugin } from 'rollup-plugin-terser';
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
	nodeResolve: nodeResolvePlugin({
		jsnext: true,
	}),
	babel: babelPlugin({
		cwd: LERNA_ROOT_PATH,
		runtimeHelpers: true,
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

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.join(PACKAGE_ROOT_PATH, 'package.json'));
const dependencies = [...keys(pkg.dependencies), ...keys(pkg.peerDependencies)];

const external = id => dependencies.includes(id) || id.includes('@babel/runtime');

const globalName = toPascalCase(LERNA_PACKAGE_NAME);
const fileName = toKebabCase(LERNA_PACKAGE_NAME);

const umdExternal = ['react', 'react-dom', 'ramda', 'ramda-extension', 'prop-types'];

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
		plugins: [plugins.babel, plugins.cjs],
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
		plugins: [plugins.babel, plugins.cjs],
	},

	// UMD Development
	{
		input: INPUT_FILE,
		external: umdExternal,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'dist', `${fileName}.js`),
			format: 'umd',
			name: globalName,
			indent: false,
			globals,
		},
		plugins: [
			plugins.nodeResolve,
			replacePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
			plugins.babel,
			plugins.cjs,
		],
	},

	// UMD Production
	{
		input: INPUT_FILE,
		external: umdExternal,
		output: {
			file: path.join(PACKAGE_ROOT_PATH, 'dist', `${fileName}.min.js`),
			format: 'umd',
			name: globalName,
			indent: false,
			globals,
		},
		plugins: [
			plugins.nodeResolve,
			replacePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
			plugins.babel,
			plugins.cjs,
			plugins.terser,
		],
	},
];
