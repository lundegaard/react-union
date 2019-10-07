module.exports = (api, { library = false, test = false, loose = true, universal = true }) => ({
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					ie: 9,
				},
				loose,
				useBuiltIns: library ? false : 'entry',
				corejs: '3.1.3',
				modules: library ? false : 'auto',
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

		// Rest
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-transform-react-constant-elements',
		'@babel/plugin-transform-regenerator',
		'@babel/plugin-transform-runtime',
		// NOTE: This plugin is also used when building the server in `react-union-scripts`.
		// NOTE: In order to allow passing e.g. `import * as reducers from './reducers'` as an object,
		// loose option must be false.
		test && ['@babel/plugin-transform-modules-commonjs', { loose: false }],
		universal && 'babel-plugin-universal-import',
	].filter(Boolean),
});
