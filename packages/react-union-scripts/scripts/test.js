const jest = require('jest');
const { any, anyPass, equals, pick, omit, join, has, o, keys } = require('ramda');
const { isNotEmpty } = require('ramda-extension');
const path = require('path');
const fs = require('fs');

const { debug } = require('./lib/cli');
const { resolveSymlink } = require('./lib/fs');

const hasWatch = any(anyPass([equals('--watchAll'), equals('--watch')]));
const hasCoverage = any(equals('--coverage'));
const joinWithCommaSpace = o(join(', '), keys);

const rootDir = process.cwd();

const supportedKeys = [
	'collectCoverageFrom',
	'coverageReporters',
	'coverageThreshold',
	'resetMocks',
	'resetModules',
	'snapshotSerializers',
	'watchPathIgnorePatterns',
];

const pickSupported = pick(supportedKeys);
const pickUnsupported = omit(supportedKeys);
const containsSetupOption = has('setupFilesAfterEnv');

const filePattern =
	'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$';

const getConfig = jestConfig => {
	const setupTestsFiles = fs.existsSync(path.resolve(rootDir, 'testsSetup.js'))
		? ['<rootDir>/testsSetup.js']
		: undefined;

	const unsupported = pickUnsupported(jestConfig);

	if (isNotEmpty(unsupported)) {
		console.log(
			`You passed follow unsupported options for jest config: ${joinWithCommaSpace(unsupported)}.
They will be ignored.`
		);
	}

	if (containsSetupOption(unsupported)) {
		console.log(
			`Instead of using "setupFilesAfterEnv" inside package.json#jest,
create "testsSetup.js" file in root of your project.`
		);
	}

	const sanitizedConfig = pickSupported(jestConfig);

	return {
		cacheDirectory: '/tmp/jest_cache',
		globals: {
			__DEV__: true,
		},
		transform: {
			'^.+\\.jsx?$': require.resolve('babel-jest'),
			'^.+\\.s?css$': resolveSymlink(__dirname, 'jest/scssTransformer.js'),
			[filePattern]: resolveSymlink(__dirname, 'jest/fileTransformer.js'),
		},
		rootDir,
		setupFilesAfterEnv: setupTestsFiles,
		moduleFileExtensions: ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'node'],
		transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
		...sanitizedConfig,
	};
};

function test() {
	const options = process.argv.slice(3);

	process.env.BABEL_ENV = 'test';
	process.env.NODE_ENV = 'test';

	// eslint-disable-next-line import/no-dynamic-require
	const passedJestConfig = Object.assign({}, require(`${rootDir}/package.json`).jest);

	const includeWatch = debug && !hasWatch(options) && !hasCoverage(options);
	const jestOptions = [
		...(includeWatch ? ['--watchAll'] : []),
		...['--config', JSON.stringify(getConfig(passedJestConfig))],
	];

	return jest.run(jestOptions);
}

module.exports = test;
