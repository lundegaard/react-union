const loose = true;

module.exports = (api, { library, test }) => ({
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					ie: 9,
				},
				loose,
				useBuiltIns: library ? false : 'entry',
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
		(!library || test) && '@babel/plugin-transform-modules-commonjs',
		'babel-plugin-universal-import',
	].filter(Boolean),
});
