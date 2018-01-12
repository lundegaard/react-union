import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import path from 'ramda/src/path';
import map from 'ramda/src/map';
import fromPairs from 'ramda/src/fromPairs';
import contains from 'ramda/src/contains';
import filter from 'ramda/src/filter';
import flip from 'ramda/src/flip';

import validateDomMarks from './validateDomMarks';

const flipContains = flip(contains);
const getPath = path(['path']);
const mapName = map(path(['name']));
const routeP = route => new Promise(resolve => route.getComponents(resolve));

const selectDomMarks = parent => parent.querySelectorAll('[data-union-widget]');
const parseDomMarks = o(unary(JSON.parse), path(['innerHTML']));
const getDomMarks = o(map(parseDomMarks), selectDomMarks);

const getDomMarksByName = o(fromPairs, map(x => [x.name, x]));

const getComponents = (routes, domMarks) => {
	const paths = mapName(domMarks);

	const marksByName_ = getDomMarksByName(domMarks);

	const pairComponentWithMark_ = route => component => ({
		component,
		mark: path([route.path], marksByName_),
	});

	const loadFoundComponents_ = o(
		map(route => routeP(route).then(pairComponentWithMark_(route))),
		filter(o(flipContains(paths), getPath))
	);

	return loadFoundComponents_(routes);
};

/**
 * Function finds DOM marks in `parent`
 * and pairs them with components returned by correspoding `routes`.
 *
 * @param  {Array} routes [description]
 * @param  {DOM Element} parent 	The root DOM element where to find DOM marks.
 * @return {Promise}        		Resolves with array of DOM marks and corresponding component:
 *
 *                                   	[{
 *                                   		component,
 *                                   		mark: {
 *                                   			name,
 *                                   			path,
 *                                   			namespace,
 *                                   			...
 *                                   		}
 *                                   	}, ...]
 *
 */
const scan = (routes, parent) => {
	const domMarks = getDomMarks(parent);

	validateDomMarks(domMarks);

	const components = getComponents(routes, domMarks);

	return Promise.all(components);
};

export default scan;
