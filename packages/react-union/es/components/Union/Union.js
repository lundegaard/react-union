var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Widgets from './Widgets';

import { noop } from '../../utils';
import { RouteShape } from '../../shapes';
import _scan from '../../scan';

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

			_scan(routes, domParent).then(function (configs) {
				onEndScan(configs);
				_this2.setState({ configs: configs });
			}, function (error) {
				return onErrorScan(error);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				this.props.children,
				React.createElement(Widgets, { configs: this.state.configs })
			);
		}
	}]);

	return Union;
}(Component);

Union.propTypes = {
	children: PropTypes.node,
	onEndScan: PropTypes.func,
	onErrorScan: PropTypes.func,
	onStartScan: PropTypes.func,
	parent: PropTypes.object,
	routes: PropTypes.arrayOf(PropTypes.shape(RouteShape))
};
Union.defaultProps = {
	onEndScan: noop,
	onErrorScan: noop,
	onStartScan: noop
};


export default Union;