module.exports = {
	automock: false,
	bail: false,
	cacheDirectory: '/tmp/jest_cache',
	globals: {
		__DEV__: true,
	},
	moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
	transform: {
		'^.+\\.jsx?$': require.resolve('babel-jest'),
	},
	modulePathIgnorePatterns: ['/build/', '/scripts/', '/node_modules/', '/docs/'],
};
