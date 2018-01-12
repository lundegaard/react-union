'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Widgets = require('./Widgets');

var _Widgets2 = _interopRequireDefault(_Widgets);

var _utils = require('../../utils');

var _shapes = require('../../shapes');

var _scan2 = require('../../scan');

var _scan3 = _interopRequireDefault(_scan2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Union = function (_Component) {
	_inherits(Union, _Component);

	function Union() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, Union);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Union.__proto__ || Object.getPrototypeOf(Union)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			configs: []
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Union, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.scan(this.props);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (nextProps.routes !== this.props.routes) {
				this.scan(nextProps);
			}
		}
	}, {
		key: 'scan',
		value: function scan(props) {
			var _this2 = this;

			var onStartScan = props.onStartScan,
			    onEndScan = props.onEndScan,
			    onErrorScan = props.onErrorScan,
			    parent = props.parent,
			    routes = props.routes;


			onStartScan();

			var domParent = parent || document.body;

			(0, _scan3.default)(routes, domParent).then(function (configs) {
				onEndScan(configs);
				_this2.setState({ configs: configs });
			}, function (error) {
				return onErrorScan(error);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				this.props.children,
				_react2.default.createElement(_Widgets2.default, { configs: this.state.configs })
			);
		}
	}]);

	return Union;
}(_react.Component);

Union.propTypes = {
	children: _propTypes2.default.node,
	onEndScan: _propTypes2.default.func,
	onErrorScan: _propTypes2.default.func,
	onStartScan: _propTypes2.default.func,
	parent: _propTypes2.default.object,
	routes: _propTypes2.default.arrayOf(_propTypes2.default.shape(_shapes.RouteShape))
};
Union.defaultProps = {
	onEndScan: _utils.noop,
	onErrorScan: _utils.noop,
	onStartScan: _utils.noop
};
exports.default = Union;