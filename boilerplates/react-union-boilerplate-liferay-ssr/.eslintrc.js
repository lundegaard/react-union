module.exports = {
	root: true,
	extends: ['react-union'],
	rules: {
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: [
					'**/tools/*',
					'**/__tests__/*',
					'testsSetup.js',
					'packages/**/scripts/*.js',
					'*.config.js',
				],
			},
		],
	},
};
