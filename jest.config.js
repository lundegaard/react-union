module.exports = {
	bail: true,
	verbose: true,
	testPathIgnorePatterns: [
		'/.history/',
		'/node_modules/',
		'<rootDir>/boilerplates/',
		'/scripts/test.js',
		'/es',
		'/dist',
		'/lib',
	],
	projects: [
		'<rootDir>/packages/*',
	],
};
