const { NODE_ENV, BABEL_ENV } = process.env;

const cjs = NODE_ENV === 'test' || BABEL_ENV === 'commonjs';

const loose = true;

module.exports = () => ({
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					ie: 9,
				},
				useBuiltIns: false,
				modules: false,
			},
		],
		'@babel/preset-react',
	],
	plugins: [
		// Stage 1
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-logical-assignment-operators',
		['@babel/plugin-proposal-optional-chaining', { loose }],
		['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
		['@babel/plugin-proposal-nullish-coalescing-operator', { loose }],
		'@babel/plugin-proposal-do-expressions',
		// Stage 2
		['@babel/plugin-proposal-decorators', { legacy: true }],
		'@babel/plugin-proposal-function-sent',
		'@babel/plugin-proposal-export-namespace-from',
		'@babel/plugin-proposal-numeric-separator',
		'@babel/plugin-proposal-throw-expressions',
		// Stage 3
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-syntax-import-meta',
		['@babel/plugin-proposal-class-properties', { loose }],
		'@babel/plugin-proposal-json-strings',
		// rest
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-transform-react-constant-elements',
		[
			'@babel/plugin-transform-regenerator',
			{
				async: false,
			},
		],
		[
			'@babel/plugin-transform-runtime',
			{
				helpers: false,
				regenerator: true,
			},
		],
		cjs && ['@babel/plugin-transform-modules-commonjs', { loose }],
	].filter(Boolean),
});
