'use strict';

exports.__esModule = true;
exports.ConfigShape = exports.RouteShape = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RouteShape = exports.RouteShape = {
	container: _propTypes2.default.string,
	path: _propTypes2.default.string.isRequired
};

var ConfigShape = exports.ConfigShape = {
	mark: _propTypes2.default.shape({
		name: _propTypes2.default.string.isRequired,
		container: _propTypes2.default.string,
		namespace: _propTypes2.default.string
	}),
	component: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func])
};