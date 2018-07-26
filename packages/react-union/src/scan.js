import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import map from 'ramda/src/map';
import find from 'ramda/src/find';
import whereEq from 'ramda/src/whereEq';
import zipObj from 'ramda/src/zipObj';
import converge from 'ramda/src/converge';
import unapply from 'ramda/src/unapply';
import tryCatch from 'ramda/src/tryCatch';
import always from 'ramda/src/always';
import keys from 'ramda/src/keys';
import values from 'ramda/src/values';
import compose from 'ramda/src/compose';
import reduce from 'ramda/src/reduce';
import mergeDeepRight from 'ramda/src/mergeDeepRight';

import { validateDescriptorStructures, validateRoutesWithDescriptors } from './validate';

const loadRouteComponent = route => new Promise(resolve => route.getComponent(resolve));

const selectWidgetDescriptors = parent => parent.querySelectorAll('[data-union-widget]');
const selectCommonDescriptors = parent => parent.querySelectorAll('[data-union-common]');

const parseJsonContent = o(unary(JSON.parse), prop('innerHTML'));
const safelyParseJsonContent = tryCatch(parseJsonContent, always({}));

/**
 * Describes the structure of a descriptor that we work with in JS (as opposed to the DOM structure).
 * Each record represents a key and a transformation function expecting a DOM element - the widget descriptor.
 * The results of calling the functions with the DOM element are set at the appropriate keys.
 *
 * @type {Object.<string, Function>}
 */
const elementTransformationsByKey = {
	widget: path(['dataset', 'unionWidget']),
	container: path(['dataset', 'unionContainer']),
	namespace: path(['dataset', 'unionNamespace']),
	data: safelyParseJsonContent,
};

const pairArrayWithDescriptorKeys = zipObj(keys(elementTransformationsByKey));
// zipObj is a binary function but converge expects a variadic function
const pairArgsWithDescriptorKeys = unapply(pairArrayWithDescriptorKeys);
const parseDescriptor = converge(pairArgsWithDescriptorKeys, values(elementTransformationsByKey));

const getWidgetDescriptors = o(map(parseDescriptor), selectWidgetDescriptors);

const getCommonData = compose(
	reduce(mergeDeepRight, {}),
	map(safelyParseJsonContent),
	selectCommonDescriptors
);

const mergeCommonDataToConfigs = commonData =>
	map(mergeDeepRight({ descriptor: { data: commonData } }));

const loadConfigs = (routes, descriptors) => {
	const findRouteByDescriptor = ({ widget }) => find(whereEq({ path: widget }), routes);

	const pairDescriptorWithComponent = descriptor => component => ({
		component,
		descriptor,
	});

	const loadRouteComponentByDescriptor = o(loadRouteComponent, findRouteByDescriptor);

	const loadDescriptorConfig = descriptor =>
		loadRouteComponentByDescriptor(descriptor)
			.then(pairDescriptorWithComponent(descriptor))
			.catch(console.error);

	return map(loadDescriptorConfig, descriptors);
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
 *													widget,
 *													container,
 *  										 		namespace,
 *													data
 * 												}
 * 											}, ...]
 *
 */
const scan = (routes, parent) => {
	const descriptors = getWidgetDescriptors(parent);
	const commonData = getCommonData(parent);

	validateDescriptorStructures(descriptors);
	validateRoutesWithDescriptors(routes, descriptors);

	const configPromises = loadConfigs(routes, descriptors);

	return Promise.all(configPromises).then(mergeCommonDataToConfigs(commonData));
};

export default scan;
