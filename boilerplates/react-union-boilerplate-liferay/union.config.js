const getConfig = appName => ({
	name: appName,
	// set up the public path of Liferay AMD loader
	publicPath: `/o/${appName}/build/`,
	proxy: {
		// set up the URL of your locally running Liferay
		target: 'http://localhost:8081',
		// set up the public path of Liferay AMD loader
		publicPath: `/o/${appName}/build/`,
	},
});
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
				apps: [getConfig('app-demo'), getConfig('app-counter')],
		  }
		: {}),
});
