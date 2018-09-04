const {
	call,
	__,
	map,
	path,
	compose,
	forEach,
	curry,
	assoc,
	invoker,
	findIndex,
	equals,
} = require('ramda');
const { rejectNil } = require('ramda-extension');

const hoistComponentStatics = compose(
	forEach(call(__)),
	rejectNil,
	map(path(['component', 'preloadWeak']))
);

const populatePromiseMap = curry((promiseMap, context, config) => {
	const { getInitialProps } = config.component;

	if (getInitialProps) {
		promiseMap.set(config, getInitialProps({ ...context, config }));
	}
});

const getMapEntries = invoker(0, 'entries');

const replacePromisesWithValues = promiseMap =>
	compose(
		Promise.all.bind(Promise),
		map(async ([config, initialPropsPromise]) => promiseMap.set(config, await initialPropsPromise)),
		Array.from,
		getMapEntries
	)(promiseMap);

const assocInitialProps = promiseMap => config =>
	assoc('initialProps', promiseMap.get(config), config);

const addInitialPropsToConfigs = async (configs, context) => {
	const promiseMap = new Map();

	// NOTE: this section is ugly and contains side-effects
	// TODO: can probably be refactored so that we only operate on configs and don't use ES6 Map
	forEach(populatePromiseMap(promiseMap, context), configs);
	await replacePromisesWithValues(promiseMap);

	return map(assocInitialProps(promiseMap), configs);
};

// TODO: similar to getArgValue in `lib/cli.js` of react-union-scripts, we should reuse it somehow
const getPortArgument = () => {
	const index = findIndex(equals('--port'), process.argv);
	return index === -1 ? null : process.argv[index + 1];
};

module.exports = {
	hoistComponentStatics,
	addInitialPropsToConfigs,
	getPortArgument,
};
