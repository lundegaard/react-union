import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import path from 'ramda/src/path';
import map from 'ramda/src/map';
import fromPairs from 'ramda/src/fromPairs';
import contains from 'ramda/src/contains';
import filter from 'ramda/src/filter';
import flip from 'ramda/src/flip';

import validateDomMarks from './validateDomMarks';

var flipContains = flip(contains);
var getPath = path(['path']);
var mapName = map(path(['name']));
var routeP = function routeP(route) {
  return new Promise(function (resolve) {
    return route.getComponents(resolve);
  });
};

var selectDomMarks = function selectDomMarks(parent) {
  return parent.querySelectorAll('[data-union-widget]');
};
var parseDomMarks = o(unary(JSON.parse), path(['innerHTML']));
var getDomMarks = o(map(parseDomMarks), selectDomMarks);

var getDomMarksByName = o(fromPairs, map(function (x) {
  return [x.name, x];
}));

var getComponents = function getComponents(routes, domMarks) {
  var paths = mapName(domMarks);

  var marksByName_ = getDomMarksByName(domMarks);

  var pairComponentWithMark_ = function pairComponentWithMark_(route) {
    return function (component) {
      return {
        component: component,
        mark: path([route.path], marksByName_)
      };
    };
  };

  var loadFoundComponents_ = o(map(function (route) {
    return routeP(route).then(pairComponentWithMark_(route));
  }), filter(o(flipContains(paths), getPath)));

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
var scan = function scan(routes, parent) {
  var domMarks = getDomMarks(parent);

  validateDomMarks(domMarks);

  var components = getComponents(routes, domMarks);

  return Promise.all(components);
};

export default scan;