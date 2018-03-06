module.exports = (/* cli */) => ({
	apps: [
		{
			name: 'SampleApp',
			proxy: {
				publicPath: '/',
				target: 'http://localhost:8080',
			},
		},
	],
});
