module.exports = cli => ({
	apps: [
		{
			name: 'SampleApp',
			proxy: {
				publicPath: '/',
				target: 'http://localhost:8080',
			},
			outputMapper:
				cli.target === 'liferay'
					? {
							js: 'app/js',
						}
					: {},
		},
	],
});
