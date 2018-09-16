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
const getPort = () => {
	const index = findIndex(equals('--port'), process.argv);
	const argument = index === -1 ? null : process.argv[index + 1];
	return argument || process.env.SSR_PORT || 3303;
};

// TODO: add chalk
const printUsage = port => {
	const log = console.log.bind(console);

	log(`🚀 React-union SSR server is listening on port ${port}.`);
	log();
	log('🔧 Basic usage:');
	log();
	log('    Instead of sending any HTML directly to the client, pipe it using "POST /" requests');
	log('    through this Node.js server. The raw HTML should be the body of the request.');
	log('    The response body will contain the new HTML to send to the client.');
	log();
	log('📄 HTTP status reference:');
	log();
	log('    200    Business as usual. Everything is set-up properly and you can enjoy your');
	log('           blazingly fast loading speeds and SEO.');
	log();
	log('    500    Something went wrong. This might be due to wrong configuration,');
	log('           invalid CMS data or an unhandled application exception. Either way,');
	log('           you should send the original HTML to the client instead of an error.');
	log('           The console will contain more info about the exception.');
	log();
	log();
	log('See https://react-union.org/ for documentation and API reference.');
	log();
};

module.exports = {
	hoistComponentStatics,
	getAllInitialProps,
	getPort,
	printUsage,
};
