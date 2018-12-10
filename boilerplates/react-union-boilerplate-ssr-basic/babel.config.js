module.exports = api => {
	api.cache.using(() => process.env.NODE_ENV);

	return api.env('test')
		? {
				presets: ['babel-preset-react-union'],
				plugins: ['babel-plugin-dynamic-import-node'],
		  }
		: {
				presets: ['babel-preset-react-union'],
		  };
};
