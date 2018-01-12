module.exports = {
	extends: ['./rules/base', './rules/imports'].map(require.resolve),
	rules: {},
};
