'use strict';

exports.__esModule = true;

var _o = require('ramda/src/o');

var _o2 = _interopRequireDefault(_o);

var _unary = require('ramda/src/unary');

var _unary2 = _interopRequireDefault(_unary);

var _path = require('ramda/src/path');

var _path2 = _interopRequireDefault(_path);

var _map = require('ramda/src/map');

var _map2 = _interopRequireDefault(_map);

var _fromPairs = require('ramda/src/fromPairs');

var _fromPairs2 = _interopRequireDefault(_fromPairs);

var _contains = require('ramda/src/contains');

var _contains2 = _interopRequireDefault(_contains);

var _filter = require('ramda/src/filter');

var _filter2 = _interopRequireDefault(_filter);

var _flip = require('ramda/src/flip');

var _flip2 = _interopRequireDefault(_flip);

var _validateDomMarks = require('./validateDomMarks');

var _validateDomMarks2 = _interopRequireDefault(_validateDomMarks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var flipContains = (0, _flip2.default)(_contains2.default);
var getPath = (0, _path2.default)(['path']);
var mapName = (0, _map2.default)((0, _path2.default)(['name']));
var routeP = function routeP(route) {
  return new Promise(function (resolve) {
    return route.getComponents(resolve);
  });
};

var selectDomMarks = function selectDomMarks(parent) {
  return parent.querySelectorAll('[data-union-widget]');
};
var parseDomMarks = (0, _o2.default)((0, _unary2.default)(JSON.parse), (0, _path2.default)(['innerHTML']));
var getDomMarks = (0, _o2.default)((0, _map2.default)(parseDomMarks), selectDomMarks);

var getDomMarksByName = (0, _o2.default)(_fromPairs2.default, (0, _map2.default)(function (x) {
  return [x.name, x];
}));

var getComponents = function getComponents(routes, domMarks) {
  var paths = mapName(domMarks);

  var marksByName_ = getDomMarksByName(domMarks);

  var pairComponentWithMark_ = function pairComponentWithMark_(route) {
    return function (component) {
      return {
        component: component,
        mark: (0, _path2.default)([route.path], marksByName_)
      };
    };
  };

  var loadFoundComponents_ = (0, _o2.default)((0, _map2.default)(function (route) {
    return routeP(route).then(pairComponentWithMark_(route));
  }), (0, _filter2.default)((0, _o2.default)(flipContains(paths), getPath)));

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

  (0, _validateDomMarks2.default)(domMarks);

  var components = getComponents(routes, domMarks);

  return Promise.all(components);
};

exports.default = scan;