module.exports = ({ target }) =>
	target === 'liferay'
		? {
			outputMapper: {
				// move JS form react-union to `widgets` folder in Liferay theme
				js: 'js',
			},
			apps: [
				{
					name: 'SampleApp',
					// setup your public path of your Liferay AMD loader
					publicPath: '/o/liferay-amd-loader/',
					proxy: {
						// setup the URL of your locally running Liferay
						target: 'http://localhost:8080',
						// setup public path of your Liferay AMD loader
						publicPath: '/o/liferay-amd-loader/',
					},
				},
			],
		}
		: {};
