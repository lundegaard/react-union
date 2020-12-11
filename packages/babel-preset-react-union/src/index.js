const defaultTargets = {
	ie: 9,
};

module.exports = (
	api,
	{
		targets = defaultTargets,
		library = false,
		test = false,
		loose = true,
		universal = true,
		presetEnvOptions = {},
		presetReactOptions = {},
		filterPlugins = (x) => x,
	}
) => ({
	presets: [
		[
			'@babel/preset-env',
			{
				loose,
				useBuiltIns: library ? false : 'entry',
				corejs: 3,
				modules: library ? false : 'auto',
				...(targets ? { targets } : {}),
				...presetEnvOptions,
			},
		],
		['@babel/preset-react', presetReactOptions],
	],
	plugins: [
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-logical-assignment-operators',
		['@babel/plugin-proposal-optional-chaining', { loose }],
		['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
		['@babel/plugin-proposal-nullish-coalescing-operator', { loose }],
		'@babel/plugin-proposal-do-expressions',

		['@babel/plugin-proposal-decorators', { legacy: true }],
		'@babel/plugin-proposal-function-sent',
		'@babel/plugin-proposal-export-namespace-from',
		'@babel/plugin-proposal-numeric-separator',
		'@babel/plugin-proposal-throw-expressions',

		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-syntax-import-meta',
		['@babel/plugin-proposal-class-properties', { loose }],
		'@babel/plugin-proposal-json-strings',

		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-transform-react-constant-elements',
		'@babel/plugin-transform-regenerator',
		'@babel/plugin-transform-destructuring',
		'@babel/plugin-transform-runtime',
		'@babel/plugin-transform-spread',
		'babel-plugin-dynamic-import-node',
		'babel-plugin-macros',
		'babel-plugin-transform-react-remove-prop-types',

		// NOTE: In order to allow passing e.g. `import * as reducers from './reducers'` as an object,
		// loose option must be false.
		test && ['@babel/plugin-transform-modules-commonjs', { loose: false }],
		// NOTE: This plugin is also used when building the server in `react-union-scripts`.
		universal && 'babel-plugin-universal-import',
	]
		.filter(Boolean)
		.filter(filterPlugins),
});
