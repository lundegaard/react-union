import { whereEq, curry, o, map, prop, ifElse, contains, always, find } from 'ramda';
import { mergeDeepRightAll, rejectNil } from 'ramda-extension';

import { invariant } from './utils';
import { INVALID_JSON } from './constants';

const mergeData = ifElse(
	contains(INVALID_JSON),
	always(INVALID_JSON),
	o(mergeDeepRightAll, rejectNil)
);

const findRouteByDescriptor = (routes, descriptor) =>
	find(whereEq({ path: descriptor.widget }), routes);

const findComponentByDescriptor = (routes, descriptor) => {
	const route = findRouteByDescriptor(routes, descriptor);

	return route ? route.component : null;
};

const makeWidgetConfig = curry((routes, commonData, descriptor) => {
	const component = findComponentByDescriptor(routes, descriptor);

	return (
		component && {
			...descriptor,
			component,
			data: mergeData([commonData, descriptor.data]),
			namespace: descriptor.namespace || descriptor.container,
		}
	);
});

const getCommonData = o(mergeData, map(prop('data')));

const route = (routes, scanResult) => {
	const { commonDescriptors, widgetDescriptors } = scanResult;
	const commonData = getCommonData(commonDescriptors);

	invariant(
		commonData !== INVALID_JSON,
		'Invalid JSON data encountered in a common descriptor. ' +
			'This is often due to a trailing comma or missing quotation marks.'
	);

	const widgetConfigs = map(makeWidgetConfig(routes, commonData), widgetDescriptors).filter(
		Boolean
	);

	return { commonData, widgetConfigs, scanResult, routes };
};

export default route;
