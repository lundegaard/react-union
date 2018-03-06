const path = require('path');

module.exports = {
	apps: [
		{
			name: 'SampleApp',
			path: path.resolve(__dirname, './src/apps/SampleApp'),
			proxy: {
				publicPath: '/',
				target: 'http://localhost:8080',
			},
		},
	],
};
