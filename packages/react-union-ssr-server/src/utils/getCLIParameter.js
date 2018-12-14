const { always, compose, equals, findIndex, ifElse } = require('ramda');

// TODO: This is copied over from react-union-scripts/scripts/lib/cli.js
const getCLIParameter = (arg, program) =>
	compose(
		ifElse(equals(-1), always(null), x => program[x + 1]),
		findIndex(equals(arg))
	)(program);

module.exports = getCLIParameter;
