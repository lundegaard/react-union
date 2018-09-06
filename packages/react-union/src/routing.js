import map from 'ramda/src/map';
import find from 'ramda/src/find';
import whereEq from 'ramda/src/whereEq';
import curry from 'ramda/src/curry';

import { invariant, mergeData } from './utils';

const findRouteByDescriptor = (routes, descriptor) =>
	find(whereEq({ path: descriptor.widget }), routes);

const findComponentByDescriptor = (routes, descriptor) => {
	const route = findRouteByDescriptor(routes, descriptor);
	invariant(route, `Missing route for widget name ${descriptor.widget}.`);
	return route.component;
};

const createWidgetConfig = curry((routes, scanResult, descriptor) => ({
	...descriptor,
	component: findComponentByDescriptor(routes, descriptor),
	data: mergeData([scanResult.commonData, descriptor.data]),
	namespace: descriptor.namespace || descriptor.container,
}));

const createWidgetConfigs = (routes, scanResult) => {
	const { widgetDescriptors } = scanResult;
	return map(createWidgetConfig(routes, scanResult), widgetDescriptors);
};

export default createWidgetConfigs;
