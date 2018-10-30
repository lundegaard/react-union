const { NODE_ENV, BABEL_ENV } = process.env;
const cjs = NODE_ENV === 'test' || BABEL_ENV === 'commonjs';
const loose = true;

module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					ie: 9,
				},
				loose,
				useBuiltIns: false,
				modules: false,
			},
		],
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		['@babel/plugin-proposal-class-properties', { loose }],
		['@babel/plugin-proposal-object-rest-spread', { loose }],
		'@babel/plugin-transform-react-jsx',
		cjs && ['@babel/plugin-transform-modules-commonjs', { loose }],
	].filter(Boolean),
};
