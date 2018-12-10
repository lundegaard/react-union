const R = require('ramda');

// TODO: similar to getArgValue in `lib/cli.js` of react-union-scripts, we should reuse it somehow
const getPort = () => {
	const index = R.findIndex(R.equals('--port'), process.argv);
	const argument = index === -1 ? null : process.argv[index + 1];
	return argument || process.env.SSR_PORT || 3303;
};

module.exports = getPort;
