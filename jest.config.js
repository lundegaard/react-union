const ignorePatterns = [
	'/.history/',
	'/node_modules/',
	'/packages/*/es',
	'/packages/*/dist',
	'/packages/*/lib',
	'/boilerplates/',
	'/scripts/test.js',
	// FIXME: The tests in react-union-scripts have been broken for some time. :(
	'/packages/react-union-scripts',
];

module.exports = {
	bail: true,
	verbose: true,
	testPathIgnorePatterns: ignorePatterns,
	coveragePathIgnorePatterns: ignorePatterns,
	snapshotSerializers: ['enzyme-to-json/serializer'],
	setupTestFrameworkScriptFile: '<rootDir>/tests/enzymeSetup.js',
};
