import o from 'ramda/src/o';
import map from 'ramda/src/map';
import find from 'ramda/src/find';
import whereEq from 'ramda/src/whereEq';
import ifElse from 'ramda/src/ifElse';
import is from 'ramda/src/is';
import prop from 'ramda/src/prop';
import mergeDeepRight from 'ramda/src/mergeDeepRight';
import compose from 'ramda/src/compose';

import { validateDescriptorStructures, validateRoutesWithDescriptors } from '../validation';

// NOTE: The following two imports should "share a common export interface".
import {
	getWidgetDescriptors as getCheerioWidgetDescriptors,
	getCommonData as getCheerioCommonData,
} from './descriptors/cheerio';

import {
	getWidgetDescriptors as getDomWidgetDescriptors,
	getCommonData as getDomCommonData,
} from './descriptors/dom';

const isParentCheerio = is(Function);

const getWidgetDescriptors = ifElse(
	isParentCheerio,
	getCheerioWidgetDescriptors,
	getDomWidgetDescriptors
);

const getCommonData = ifElse(isParentCheerio, getCheerioCommonData, getDomCommonData);

const mergeCommonDataToConfigs = commonData =>
	map(mergeDeepRight({ descriptor: { data: commonData } }));

const createConfigs = (routes, descriptors) => {
	const findRouteByDescriptor = ({ widget }) => find(whereEq({ path: widget }), routes);
	const findComponentByDescriptor = o(prop('component'), findRouteByDescriptor);

	const findDescriptorConfig = descriptor => ({
		component: findComponentByDescriptor(descriptor),
		descriptor,
	});

	return map(findDescriptorConfig, descriptors);
};

const shapeScanResult = commonData => configs => ({ commonData, configs });

/**
 * Finds widget descriptors in `parent` and pairs them with components in `routes`.
 *
 * @param  {Array} routes Route configurations.
 * @param  {Element} parent The root DOM element where to find the widget descriptors.
 * @return {Object} The object has two properties: `configs` and `commonData`.
 * 	`configs` is an array of objects with `component` and `descriptor` properties.
 * 	`commonData` is the merged JSON content of common widget descriptors.
 */
const scan = (routes, parentOr$) => {
	const descriptors = getWidgetDescriptors(parentOr$);
	const commonData = getCommonData(parentOr$);

	validateDescriptorStructures(descriptors);
	validateRoutesWithDescriptors(routes, descriptors);

	const createScanResult = compose(
		shapeScanResult(commonData),
		mergeCommonDataToConfigs(commonData),
		createConfigs
	);

	return createScanResult(routes, descriptors);
};

export default scan;
