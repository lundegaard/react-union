import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

const env = process.env.NODE_ENV;

const config = {
	input: 'src/index.js',
	external: ['react', 'react-dom'],
	plugins: [],
};

const globals = {
	react: 'React',
	'react-dom': 'ReactDOM',
};

const ROOT_PATH = path.join(__dirname, '../..');

if (env === 'es' || env === 'cjs') {
	config.output = {
		format: env,
		indent: false,
		globals,
	};
	config.plugins.push(
		nodeResolve({
			jsnext: true,
		}),
		babel({
			cwd: ROOT_PATH,
		})
	);
}

if (env === 'development' || env === 'production') {
	config.output = {
		format: 'umd',
		name: 'ReactUnion',
		indent: false,
		globals,
	};

	config.plugins.push(
		nodeResolve({
			jsnext: true,
		}),
		babel({
			cwd: ROOT_PATH,
			exclude: '**/node_modules/**',
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(env),
		})
	);
}

config.plugins.push(
	commonjs({
		include: /node_modules/,
	})
);

if (env === 'production') {
	config.plugins.push(
		terser({
			compress: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				warnings: false,
			},
		})
	);
}

export default config;
