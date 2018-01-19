const jest = require('jest');
const argv = process.argv.slice(2);
const { DEBUG } = require('./lib/cli');
const { any, anyPass, equals } = require('ramda');

const hasWatch = any(anyPass([equals('--watchAll'), equals('--watch')]));
const hasCoverage = any(equals('--coverage'));

function test() {
	const options = process.argv.slice(3);

	process.env.BABEL_ENV = 'test';
	process.env.NODE_ENV = 'test';
	process.on('unhandledRejection', err => {
		reject(err);
	});

	const includeWatch = DEBUG && !hasWatch(options) && !hasCoverage(options);
	const jestOptions = includeWatch ? [...options, '--watchAll'] : options;

	return jest.run(jestOptions);
}

module.exports = test;
