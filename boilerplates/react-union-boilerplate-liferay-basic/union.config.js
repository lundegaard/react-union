const path = require('path');

module.exports = ({ target }) => {
	return target === 'liferay' ? {
		outputMapper: {
			js: 'js/widgets',
			index: './templates/union.ftl',
		},
		apps: [{
			name: 'SampleApp',
			publicPath: '/o/liferay-7-theme/',
			proxy: {
				target: 'http://localhost:8080',
				publicPath: '/o/liferay-7-theme/',
			},
			templateFilename: 'union.ejs',
			paths: {
				build: path.resolve(__dirname, '../../../liferay-docker/liferay-7-theme/src'),
			},
		}],
	} : {};
};
