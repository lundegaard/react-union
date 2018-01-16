const path = require('path');

module.exports = {
	proxy: {
		port: 3330,
		target: 'http://localhost:8080',
	},
	devServer: {
		port: 3300,
		baseDir: path.resolve(__dirname, './build/public'),
	},
	generateVendorBundle: true,
	apps: [
		{
			name: 'SampleApp',
			path: path.resolve(__dirname, './src/apps/SampleApp'),
			// Merges with "proxy" in root of the config object
			proxy: {
				publicPath: '/o/liferay-7-theme/js/react-apps/',
			},
		},
	],
};

