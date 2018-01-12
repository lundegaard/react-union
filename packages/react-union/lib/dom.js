'use strict';

exports.__esModule = true;
exports.justRender = justRender;
exports.justUnmountComponentAtNode = justUnmountComponentAtNode;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_UNION_ROOT_ID = 'union';

function justRender(component) {
	var rootId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNION_ROOT_ID;
	var resolve = arguments[2];

	var rootElement = (0, _utils.createElementWithId)(rootId, document.body);

	_reactDom2.default.render(component, rootElement, resolve);
}

function justUnmountComponentAtNode(component) {
	var rootId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNION_ROOT_ID;

	var rootElement = document.getElementById(rootId);

	_reactDom2.default.unmountComponentAtNode(rootElement);
}