const jest = require('jest');
const { any, anyPass, equals } = require('ramda');

const { debug } = require('./lib/cli');
const { resolveSymlink } = require('./lib/utils');

const hasWatch = any(anyPass([equals('--watchAll'), equals('--watch')]));
const hasCoverage = any(equals('--coverage'));

const filePattern = '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$';

const getConfig = () => ({
	automock: false,
	bail: false,
	cacheDirectory: '/tmp/jest_cache',
	globals: {
		__DEV__: true,
	},
	moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
	transform: {
		'^.+\\.jsx?$': require.resolve('babel-jest'),
		'^.+\\.s?css$': resolveSymlink(__dirname, 'jest/scssTransformer.js'),
		[filePattern]: resolveSymlink(__dirname, 'jest/fileTransformer.js'),
	},
	modulePathIgnorePatterns: ['/build/', '/node_modules/'],
});

function test() {
	const options = process.argv.slice(3);

	process.env.BABEL_ENV = 'test';
	process.env.NODE_ENV = 'test';

	const includeWatch = debug && !hasWatch(options) && !hasCoverage(options);
	const jestOptions = [
		...(includeWatch ? ['--watchAll'] : []),
		...['--config', JSON.stringify(getConfig())],
	];

	return jest.run(jestOptions);
}

module.exports = test;
