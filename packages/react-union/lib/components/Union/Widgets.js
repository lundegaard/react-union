'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isNil = require('ramda/src/isNil');

var _isNil2 = _interopRequireDefault(_isNil);

var _map = require('ramda/src/map');

var _map2 = _interopRequireDefault(_map);

var _prop = require('ramda/src/prop');

var _prop2 = _interopRequireDefault(_prop);

var _o = require('ramda/src/o');

var _o2 = _interopRequireDefault(_o);

var _ifElse = require('ramda/src/ifElse');

var _ifElse2 = _interopRequireDefault(_ifElse);

var _utils = require('../../utils');

var _shapes = require('../../shapes');

var _WidgetPortal = require('./WidgetPortal');

var _WidgetPortal2 = _interopRequireDefault(_WidgetPortal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderUnionWidget = (0, _ifElse2.default)(_isNil2.default, _utils.noop, (0, _map2.default)(function (config) {
	return _react2.default.createElement(_WidgetPortal2.default, _extends({ key: config.mark.namespace || config.mark.container }, config));
}));

var Widgets = (0, _o2.default)(renderUnionWidget, (0, _prop2.default)('configs'));

Widgets.propTypes = {
	configs: _propTypes2.default.arrayOf(_propTypes2.default.shape(_shapes.ConfigShape))
};

exports.default = Widgets;