const path = require('path');

module.exports = {
	// eslint-disable-next-line import/no-dynamic-require
	...require(path.join(process.cwd(), 'tests/jest-enzyme.config.js')),
	testPathIgnorePatterns: [
		'/es',
		'/dist',
		'/lib',
	],
};
