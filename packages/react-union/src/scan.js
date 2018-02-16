import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import path from 'ramda/src/path';
import map from 'ramda/src/map';
import fromPairs from 'ramda/src/fromPairs';
import contains from 'ramda/src/contains';
import filter from 'ramda/src/filter';
import flip from 'ramda/src/flip';
import zipObj from 'ramda/src/zipObj';
import converge from 'ramda/src/converge';
import unapply from 'ramda/src/unapply';
import tryCatch from 'ramda/src/tryCatch';
import always from 'ramda/src/always';
import keys from 'ramda/src/keys';
import values from 'ramda/src/values';

import validateDescriptors from './validateDescriptors';

const flipContains = flip(contains);
const getPath = path(['path']);
const mapName = map(path(['name']));
const loadRouteComponent = route => new Promise(resolve => route.getComponent(resolve));

const selectDescriptors = parent => parent.querySelectorAll('[data-union-widget]');
const parseJsonContent = o(unary(JSON.parse), path(['innerHTML']));

// describes the structure of a descriptor that we work with in JS (as opposed to the DOM structure)
// each method shall receive the HTML element (the widget descriptor)
const elementTransformersByKey = {
	name: path(['dataset', 'unionWidget']),
	container: path(['dataset', 'unionContainer']),
	namespace: path(['dataset', 'unionNamespace']),
	data: tryCatch(parseJsonContent, always({})),
};

const pairArrayWithDescriptorKeys = zipObj(keys(elementTransformersByKey));
// zipObj is a binary function but converge expects a variadic function
const pairArgsWithDescriptorKeys = unapply(pairArrayWithDescriptorKeys);

const parseDescriptor = converge(pairArgsWithDescriptorKeys, values(elementTransformersByKey));
const getDescriptors = o(map(parseDescriptor), selectDescriptors);

const getDescriptorsByName = o(fromPairs, map(x => [x.name, x]));

const loadConfigs = (routes, widgetDescriptors) => {
	const descriptorNames = mapName(widgetDescriptors);
	const descriptorsByName = getDescriptorsByName(widgetDescriptors);

	const pairComponentWithDescriptor = route => component => ({
		component,
		descriptor: path([route.path], descriptorsByName),
	});

	const filterMatchedRoutes = filter(o(flipContains(descriptorNames), getPath));
	const loadRouteConfig = route =>
		loadRouteComponent(route).then(pairComponentWithDescriptor(route));

	return o(map(loadRouteConfig), filterMatchedRoutes)(routes);
};

/**
 * Function finds widget descriptors in `parent`
 * and pairs them with components returned by correspoding `routes`.
 *
 * @param  {Array} routes [description]
 * @param  {DOM Element} parent 	The root DOM element where to find the widget descriptors.
 * @return {Promise}        		Resolves with array of widget descriptors and corresponding component:
 *
 *                                   	[{
 *                                   		component,
 *                                   		descriptor: {
 *                                   			name,
 * 																				container,
 *  	                                   	namespace,
 *																				data
 *                                   		}
 *                                   	}, ...]
 *
 */
const scan = (routes, parent) => {
	const descriptors = getDescriptors(parent);

	validateDescriptors(descriptors);

	const configs = loadConfigs(routes, descriptors);

	return Promise.all(configs);
};

export default scan;
