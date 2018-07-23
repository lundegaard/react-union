import o from 'ramda/src/o';
import map from 'ramda/src/map';
import find from 'ramda/src/find';
import whereEq from 'ramda/src/whereEq';
import ifElse from 'ramda/src/ifElse';
import is from 'ramda/src/is';
import prop from 'ramda/src/prop';

import getCheerioDescriptors from './descriptors/cheerio';
import getDomDescriptors from './descriptors/dom';
import { validateDescriptorStructures, validateRoutesWithDescriptors } from '../validation';

const getDescriptors = ifElse(is(Function), getCheerioDescriptors, getDomDescriptors);

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
	const descriptors = getDescriptors(parentOr$);

	validateDescriptorStructures(descriptors);
	validateRoutesWithDescriptors(routes, descriptors);

	return getConfigs(routes, descriptors);
};

export default scan;
