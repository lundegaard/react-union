module.exports = {
	root: true,
	extends: ['react-union'],
	rules: {
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: true,
			},
		],
	},
};
