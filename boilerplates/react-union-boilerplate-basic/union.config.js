const path = require('path');

module.exports = (cli) => ({
	apps: [
		{
			name: 'SampleApp',
			path: path.resolve(__dirname, './src/apps/SampleApp'),
			proxy: {
				publicPath: '/',
				target: 'http://localhost:8080',
			},
			outputMapper: cli.target === 'liferay' ? {
				css: 'staticss/css',
			} : {},
			webpackConfig: (c) => c,
		},
	],
});

