const ignorePatterns = [
	'/.history/',
	'/node_modules/',
	'/es',
	'/dist',
	'/lib',
	'<rootDir>/boilerplates/',
	'/scripts/test.js',
];

module.exports = {
	bail: true,
	verbose: true,
	testPathIgnorePatterns: ignorePatterns,
	coveragePathIgnorePatterns: ignorePatterns,
	snapshotSerializers: ['enzyme-to-json/serializer'],
	setupTestFrameworkScriptFile: '<rootDir>/tests/enzymeSetup.js',
};
