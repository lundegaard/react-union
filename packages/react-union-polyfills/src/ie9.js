const importIE9Polyfills = () => {
	require('./ie11');

	// React 16+ relies on Map, Set, and requestAnimationFrame
	require('core-js/features/map');
	require('core-js/features/set');

	require('raf').polyfill();
	require('./ie11')();
	console.log('ie9 polyfills imported');
};

module.exports = importIE9Polyfills;
