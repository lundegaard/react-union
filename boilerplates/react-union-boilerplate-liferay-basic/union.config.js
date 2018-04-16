const path = require('path');

module.exports = ({ target }) =>
	target === 'liferay'
		? {
			outputMapper: {
				// move JS form react-union to `widgets` folder in Liferay theme
				js: 'js/widgets',
				// generate FTL template for Liferay theme that is placed to the <head />
				index: './templates/union.ftl',
			},
			apps: [
				{
					name: 'SampleApp',
					// setup your public path of your Liferay theme
					publicPath: '/o/liferay-theme/',
					paths: {
						// setup path for `src` folder of your liferay theme
						build: path.resolve(__dirname, './liferay-theme/src'),
					},
					clean: {
						// clean just js bundle, leave Liferay files
						paths: [path.resolve(__dirname, './liferay-theme/src/js/widgets')],
					},
					proxy: {
						// setup the URL of your locally running Liferay
						target: 'http://localhost:8080',
						// setup public path of your Liferay theme
						publicPath: '/o/liferay-theme/',
					},
					templateFilename: 'union.ejs',
				},
			],
		}
		: {};
