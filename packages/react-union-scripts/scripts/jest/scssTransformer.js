module.exports = {
	process() {
		return 'module.exports = {};\n';
	},
	getCacheKey() {
		return 'scssTransform';
	},
};
