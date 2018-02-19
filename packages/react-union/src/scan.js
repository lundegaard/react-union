import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import map from 'ramda/src/map';
import fromPairs from 'ramda/src/fromPairs';
import flip from 'ramda/src/flip';
import zipObj from 'ramda/src/zipObj';
import converge from 'ramda/src/converge';
import unapply from 'ramda/src/unapply';
import tryCatch from 'ramda/src/tryCatch';
import always from 'ramda/src/always';
import keys from 'ramda/src/keys';
import values from 'ramda/src/values';

import { validateDescriptorStructures, validateRoutesWithDescriptors } from './validate';

const loadRouteComponent = route => new Promise(resolve => route.getComponent(resolve));

const selectDescriptors = parent => parent.querySelectorAll('[data-union-widget]');
const parseJsonContent = o(unary(JSON.parse), prop('innerHTML'));

/**
 * Describes the structure of a descriptor that we work with in JS (as opposed to the DOM structure).
 * Each record represents a key and a transformation function expecting a DOM element - the widget descriptor.
 * The results of calling the functions with the DOM element are set at the appropriate keys.
 *
 * @type {Object.<string, Function>}
 */
const elementTransformationsByKey = {
	name: path(['dataset', 'unionWidget']),
	container: path(['dataset', 'unionContainer']),
	namespace: path(['dataset', 'unionNamespace']),
	data: tryCatch(parseJsonContent, always({})),
};

const pairArrayWithDescriptorKeys = zipObj(keys(elementTransformationsByKey));
// zipObj is a binary function but converge expects a variadic function
const pairArgsWithDescriptorKeys = unapply(pairArrayWithDescriptorKeys);
const parseDescriptor = converge(pairArgsWithDescriptorKeys, values(elementTransformationsByKey));

const getDescriptors = o(map(parseDescriptor), selectDescriptors);
const getRoutesByPath = o(fromPairs, map(route => [route.path, route]));

const loadConfigs = (routes, descriptors) => {
	const routesByPath = getRoutesByPath(routes);
	const findRouteByPath = flip(prop)(routesByPath);
	const findRouteByDescriptor = o(findRouteByPath, prop('name'));

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
 *													name,
 *													container,
 *  										 		namespace,
 *													data
 * 												}
 * 											}, ...]
 *
 */
const scan = (routes, parent) => {
	const descriptors = getDescriptors(parent);

	validateDescriptorStructures(descriptors);
	validateRoutesWithDescriptors(routes, descriptors);

	const configs = loadConfigs(routes, descriptors);

	return Promise.all(configs);
};

export default scan;
