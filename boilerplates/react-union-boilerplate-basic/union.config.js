const path = require('path');

module.exports = {
	devServer: {
		port: 3300,
		baseDir: path.resolve(__dirname, './build/public'),
	},
	generateVendorBundle: true,
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

