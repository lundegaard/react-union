'use strict';

exports.__esModule = true;

var _forEach = require('ramda/src/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _forEach2.default)(function (_ref) {
	var name = _ref.name,
	    namespace = _ref.namespace,
	    container = _ref.container;

	(0, _utils.invariant)(name, 'Missing \'name\' in DOM mark.');
	(0, _utils.invariant)(namespace || container, 'Missing required attributes for the widget "' + name + '". ' + 'Fill in "namespace" or "container" in the DOM mark.');
});