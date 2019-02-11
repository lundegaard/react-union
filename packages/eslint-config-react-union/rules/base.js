module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 7,
		sourceType: 'module',
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		jest: true,
		node: true,
	},
	globals: {
		__DEV__: true,
	},
	plugins: ['babel', 'import'],
	rules: {
		'array-bracket-spacing': ['error', 'never'],
		'array-callback-return': 'error',
		'arrow-spacing': 'error',
		'arrow-parens': 'off',
		'babel/new-cap': 'error',
		'block-spacing': ['error', 'always'],
		'brace-style': 'error',
		'comma-dangle': ['error', 'always-multiline'],
		'comma-spacing': [
			'error',
			{
				before: false,
				after: true,
			},
		],
		'comma-style': ['error', 'last'],
		'computed-property-spacing': ['error', 'never'],
		'consistent-this': ['error', 'self'],
		'consistent-return': 'off',
		'dot-notation': 'error',
		'dot-location': ['error', 'property'],
		eqeqeq: ['error', 'smart'],
		'eol-last': 'error',
		'generator-star-spacing': 'error',
		'id-blacklist': ['error'],
		'keyword-spacing': 'error',
		'key-spacing': 'error',
		'max-len': [
			'error',
			{
				code: 120,
				ignoreComments: true,
			},
		],
		'new-cap': [
			'off',
			{
				capIsNew: true,
				newIsCap: true,
			},
		],
		'no-array-constructor': 'error',
		'no-await-in-loop': 'error',
		'no-empty-pattern': 'error',
		'no-case-declarations': 'off',
		'no-dupe-keys': 'error',
		'no-dupe-args': 'error',
		'no-duplicate-case': 'error',
		'no-cond-assign': 'error',
		'no-const-assign': 'error',
		'no-extra-semi': 'error',
		'no-extra-boolean-cast': 'error',
		'no-loop-func': 'error',
		'no-multiple-empty-lines': 'error',
		'no-multi-spaces': 'error',
		'no-shadow': 'off',
		'no-spaced-func': 'error',
		'no-trailing-spaces': 'error',
		'no-undef': 'error',
		'no-unneeded-ternary': 'error',
		'no-unreachable': 'error',
		'no-unused-expressions': 'error',
		'no-unused-vars': 'error',
		'no-var': 'error',
		'object-shorthand': 'error',
		'one-var': ['error', 'never'],

		'operator-linebreak': 'off',
		'padded-blocks': ['error', 'never'],
		'prefer-arrow-callback': 'off',
		'prefer-const': 'error',
		'prefer-template': 'error',
		'prefer-spread': 'error',
		quotes: ['error', 'single', 'avoid-escape'],
		semi: ['error', 'always'],
		'space-before-blocks': ['error', 'always'],
		'space-before-function-paren': [
			'error',
			{ anonymous: 'never', named: 'never', asyncArrow: 'always' },
		],
		'space-infix-ops': 'error',
		'space-unary-ops': [
			'error',
			{
				words: true,
				nonwords: false,
			},
		],
		'spaced-comment': 'error',
		strict: 'off',
		yoda: 'error',
	},
};
