module.exports = {
	root: true,
	extends: ['react-union'],
	globals: {
		__DEV__: true,
	},
	rules: {
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: true,
			},
		],
	},
};
