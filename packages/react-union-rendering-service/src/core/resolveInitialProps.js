const R = require('ramda');

const makeGetInitialProps = context => ({ component, ...widgetConfig }) =>
	component.getInitialProps
		? component.getInitialProps({ ...context, ...widgetConfig })
		: Promise.resolve(null);

/**
 * Asynchronously returns an array of initial props with the indices corresponding
 * to the passed widget configs.
 *
 * @param {Array} widgetConfigs widget configs
 * @param {Object} context argument to call the initialProps methods with
 */
const resolveInitialProps = async (context, widgetConfigs) => {
	const getInitialProps = makeGetInitialProps(context);
	const promises = R.map(getInitialProps, widgetConfigs);
	const namespaces = R.map(R.prop('namespace'), widgetConfigs);

	return R.zipObj(namespaces, await Promise.all(promises));
};

module.exports = resolveInitialProps;
