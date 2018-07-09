import o from 'ramda/src/o';
import map from 'ramda/src/map';
import find from 'ramda/src/find';
import whereEq from 'ramda/src/whereEq';
import ifElse from 'ramda/src/ifElse';
import is from 'ramda/src/is';
import prop from 'ramda/src/prop';
import mergeDeepRight from 'ramda/src/mergeDeepRight';
import compose from 'ramda/src/compose';

import { validateDescriptorStructures, validateRoutesWithDescriptors } from '../validate';

import {
	getWidgetDescriptors as getCheerioWidgetDescriptors,
	getCommonData as getCheerioCommonData,
} from './descriptors/cheerio';

import {
	getWidgetDescriptors as getDomWidgetDescriptors,
	getCommonData as getDomCommonData,
} from './descriptors/dom';

const getWidgetDescriptors = ifElse(
	is(Function),
	getCheerioWidgetDescriptors,
	getDomWidgetDescriptors
);

const getCommonData = ifElse(is(Function), getCheerioCommonData, getDomCommonData);

const mergeCommonDataToConfigs = commonData =>
	map(mergeDeepRight({ descriptor: { data: commonData } }));

const getConfigs = (routes, descriptors) => {
	const findRouteByDescriptor = ({ name }) => find(whereEq({ path: name }), routes);
	const findComponentByDescriptor = o(prop('component'), findRouteByDescriptor);

	const findDescriptorConfig = descriptor => ({
		component: findComponentByDescriptor(descriptor),
		descriptor,
	});

	return map(findDescriptorConfig, descriptors);
};

/**
 * Finds widget descriptors in `parent` and pairs them with components returned by correspoding `routes`.
 *
 * @param  {Array} routes Route configurations.
 * @param  {Element} parent The root DOM element where to find the widget descriptors.
 * @return {Promise} Resolves with array of widget descriptors and corresponding component:
 *
 *											[{
 *												component,
 *												descriptor: {
 *													name,
 *													container,
 *  										 		namespace,
 *													data
 * 												}
 * 											}, ...]
 *
 */
const scan = (routes, parentOr$) => {
	const descriptors = getWidgetDescriptors(parentOr$);
	const commonData = getCommonData(parent);

	validateDescriptorStructures(descriptors);
	validateRoutesWithDescriptors(routes, descriptors);

	const getConfigsWithCommonData = compose(
		mergeCommonDataToConfigs(commonData),
		getConfigs
	);

	return getConfigsWithCommonData(routes, descriptors);
};

export default scan;
