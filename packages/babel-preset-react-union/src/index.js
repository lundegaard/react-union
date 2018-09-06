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
		['@babel/plugin-proposal-optional-chaining', { loose: false }],
		['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
		['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
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
		['@babel/plugin-proposal-class-properties', { loose: false }],
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
	],
	env: {
		test: {
			presets: [['@babel/preset-env', { modules: 'commonjs' }], '@babel/preset-react'],
		},
	},
});
