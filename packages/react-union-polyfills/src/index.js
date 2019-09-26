module.exports = {
	importPolyfills: {
		stable: require('./stable')(),
		ie9: require('./ie9'),
		ie11: require('./ie11'),
	},
};
