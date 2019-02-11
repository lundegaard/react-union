const { NODE_ENV } = process.env;

module.exports = {
	presets: [
		[
			'babel-preset-react-union',
			{
				library: true,
				test: NODE_ENV === 'test',
			},
		],
	],
};
