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
const routeP = route => new Promise(resolve => route.getComponents(resolve));

const selectDescriptors = parent => parent.querySelectorAll('[data-union-widget]');
const parseJsonContent = o(unary(JSON.parse), path(['innerHTML']));

const elementTransformersByKey = {
	name: path(['dataset', 'unionWidget']),
	container: path(['dataset', 'unionContainer']),
	namespace: path(['dataset', 'unionNamespace']),
	data: tryCatch(parseJsonContent, always({})),
};

const pairArrayWithDescriptorKeys = zipObj(keys(elementTransformersByKey));
const pairArgsWithDescriptorKeys = unapply(pairArrayWithDescriptorKeys);

const parseDescriptor = converge(pairArgsWithDescriptorKeys, values(elementTransformersByKey));
const getDescriptors = o(map(parseDescriptor), selectDescriptors);

const getDescriptorsByName = o(fromPairs, map(x => [x.name, x]));

const getComponents = (routes, widgetDescriptors) => {
	const paths = mapName(widgetDescriptors);

	const descriptorsByName_ = getDescriptorsByName(widgetDescriptors);

	const pairComponentWithDescriptor_ = route => component => ({
		component,
		descriptor: path([route.path], descriptorsByName_),
	});

	const loadFoundComponents_ = o(
		map(route => routeP(route).then(pairComponentWithDescriptor_(route))),
		filter(o(flipContains(paths), getPath))
	);

	return loadFoundComponents_(routes);
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

	const components = getComponents(routes, descriptors);

	return Promise.all(components);
};

export default scan;
