module.exports = {
	bail: true,
	verbose: true,
	testPathIgnorePatterns: [
		'/.history/',
		'/node_modules/',
		'<rootDir>/boilerplates/',
		'<rootDir>/packages/react-union-scripts/scripts/test.js',
		'<rootDir>/packages/react-union/es',
		'<rootDir>/packages/react-union/dist',
		'<rootDir>/packages/react-union/lib',
	],
	setupTestFrameworkScriptFile: '<rootDir>/testsSetup.js',
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
};
