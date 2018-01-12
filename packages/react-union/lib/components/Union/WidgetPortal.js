'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _utils = require('../../utils');

var _shapes = require('../../shapes');

var _WidgetProvider = require('../WidgetProvider');

var _WidgetProvider2 = _interopRequireDefault(_WidgetProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var WidgetPortal = function WidgetPortal(_ref) {
	var WidgetComponent = _ref.component,
	    mark = _ref.mark;

	var name = mark.name,
	    container = mark.container,
	    namespace = mark.namespace,
	    rest = _objectWithoutProperties(mark, ['name', 'container', 'namespace']);

	var resolvedNamespace = namespace || container;

	(0, _utils.invariant)(!WidgetComponent || container, 'Missing attribute "container" for the widget "' + name + '" to be rendered.');

	var widgetProps = { namespace: resolvedNamespace };
	var el = document.getElementById(container);

	(0, _utils.warning)(el, 'HTML container with id "' + container + '" is not found for widget wtih name "' + name + '"');

	return WidgetComponent && el ? (0, _reactDom.createPortal)(_react2.default.createElement(
		_WidgetProvider2.default,
		widgetProps,
		_react2.default.createElement(WidgetComponent, _extends({}, widgetProps, rest))
	), el) : null;
};

WidgetPortal.propTypes = _extends({}, _shapes.ConfigShape);

exports.default = WidgetPortal;