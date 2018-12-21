module.exports = ({ target }) => ({
	workspaces: {
		widgetPattern: ['widget'],
		appPattern: ['app'],
	},
	sourceMaps: false,
	...(target === 'liferay'
		? {
				outputMapper: {
					js: 'js',
					css: 'css',
				},
				apps: [
					{
						name: 'app-demo',
						// set up the public path of Liferay AMD loader
						publicPath: '/o/liferay-amd-loader/app-demo/',
						proxy: {
							// set up the URL of your locally running Liferay
							target: 'http://localhost:8080',
							// set up the public path of Liferay AMD loader
							publicPath: '/o/liferay-amd-loader/app-demo/',
						},
					},
				],
		  }
		: {}),
});
