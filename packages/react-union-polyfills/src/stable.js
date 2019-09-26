const importPolyfills = () => {
	console.log('Stable polyfills imported');
	require('core-js/stable');
	require('regenerator-runtime/runtime');
};

module.exports = importPolyfills;
