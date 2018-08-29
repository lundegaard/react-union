const { call, __, map, path, compose, forEach, curry, assoc, invoker } = require('ramda');
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

const replacePromisesWithValuesP = promiseMap =>
	compose(
		Promise.all.bind(Promise),
		map(async ([config, initialPropsP]) => promiseMap.set(config, await initialPropsP)),
		Array.from,
		getMapEntries
	)(promiseMap);

const assocInitialProps = promiseMap => config =>
	assoc('initialProps', promiseMap.get(config), config);

const addInitialPropsToConfigs = async (configs, context) => {
	const promiseMap = new Map();

	// NOTE: this section is ugly and contains side-effects
	forEach(populatePromiseMap(promiseMap, context), configs);
	await replacePromisesWithValuesP(promiseMap);
	// NOTE: here ends the ugly section

	return map(assocInitialProps(promiseMap), configs);
};

module.exports = {
	hoistComponentStatics,
	addInitialPropsToConfigs,
};
