import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

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
		babel()
	);
}

if (env === 'development' || env === 'production') {
	config.output = {
		format: 'umd',
		name: 'Redux',
		indent: false,
		globals,
	};

	config.plugins.push(
		nodeResolve({
			jsnext: true,
		}),
		babel({
			exclude: '**/node_modules/**',
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(env),
		})
	);
}

config.plugins.push(commonjs());

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
