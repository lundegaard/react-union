import map from 'ramda/src/map';
import find from 'ramda/src/find';
import whereEq from 'ramda/src/whereEq';
import curry from 'ramda/src/curry';
import o from 'ramda/src/o';
import prop from 'ramda/src/prop';

import { invariant, mergeData } from './utils';
import { INVALID_JSON } from './constants';

const findRouteByDescriptor = (routes, descriptor) =>
	find(whereEq({ path: descriptor.widget }), routes);

const findComponentByDescriptor = (routes, descriptor) => {
	const route = findRouteByDescriptor(routes, descriptor);
	invariant(route, `Missing route for widget name ${descriptor.widget}.`);
	return route.component;
};

const createWidgetConfig = curry((routes, commonData, descriptor) => ({
	...descriptor,
	component: findComponentByDescriptor(routes, descriptor),
	data: mergeData([commonData, descriptor.data]),
	namespace: descriptor.namespace || descriptor.container,
}));

const getCommonData = o(mergeData, map(prop('data')));

const route = (routes, scanResult) => {
	const { commonDescriptors, widgetDescriptors } = scanResult;
	const commonData = getCommonData(commonDescriptors);

	invariant(
		commonData !== INVALID_JSON,
		'Invalid JSON data encountered in a common descriptor. ' +
			'This is often due to a trailing comma or missing quotation marks.'
	);

	const widgetConfigs = map(createWidgetConfig(routes, commonData), widgetDescriptors);

	return { commonData, widgetConfigs, scanResult, routes };
};

export default route;
