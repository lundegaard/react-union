const { call, __, map, path, compose, forEach, findIndex, equals } = require('ramda');
const { rejectNil } = require('ramda-extension');

const hoistComponentStatics = compose(
	forEach(call(__)),
	rejectNil,
	map(path(['component', 'preloadWeak']))
);

const getInitialProps = context => ({ component, ...widgetConfig }) =>
	component.getInitialProps
		? component.getInitialProps({ ...context, ...widgetConfig })
		: Promise.resolve(null);

/**
 * Returns an array of initial props with the indices corresponding to the passed widget configs.
 *
 * @param {Array} widgetConfigs widget configs
 * @param {Object} context argument to call the initialProps with
 */
const getAllInitialProps = async (widgetConfigs, context) => {
	const promises = map(getInitialProps(context), widgetConfigs);
	return await Promise.all(promises);
};

// TODO: similar to getArgValue in `lib/cli.js` of react-union-scripts, we should reuse it somehow
const getPortArgument = () => {
	const index = findIndex(equals('--port'), process.argv);
	return index === -1 ? null : process.argv[index + 1];
};

module.exports = {
	hoistComponentStatics,
	getAllInitialProps,
	getPortArgument,
};
