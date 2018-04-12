const path = require('path');

module.exports = ({ target }) => {
	return target === 'liferay' ? {
		outputMapper: {
			// move JS form react-union to `widgets` folder in Liferay theme
			js: 'js/widgets',
			// generate FTL template for Liferay theme that is placed to header
			index: './templates/union.ftl',
		},
		apps: [{
			name: 'SampleApp',
			publicPath: '/o/your-liferay-theme/',
			proxy: {
				target: 'http://localhost:8080',
				publicPath: '/o/your-liferay-theme/',
			},
			// path to empty template
			templateFilename: 'union.ejs',
			paths: {
				build: path.resolve(__dirname, 'path-to-your-liferay-theme/src'),
			},
		}],
	} : {};
};
