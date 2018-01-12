var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import { Component } from 'react';
import omit from 'ramda/src/omit';

var omitNonContextProps = omit(['namespace', 'children']);

var WidgetProvider = function (_Component) {
	_inherits(WidgetProvider, _Component);

	function WidgetProvider() {
		_classCallCheck(this, WidgetProvider);

		return _possibleConstructorReturn(this, (WidgetProvider.__proto__ || Object.getPrototypeOf(WidgetProvider)).apply(this, arguments));
	}

	_createClass(WidgetProvider, [{
		key: 'getChildContext',
		value: function getChildContext() {
			return {
				widget: {
					namespace: this.props.namespace,
					props: omitNonContextProps(this.props)
				}
			};
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props,
			    namespace = _props.namespace,
			    children = _props.children;


			return children;
		}
	}]);

	return WidgetProvider;
}(Component);

WidgetProvider.childContextTypes = {
	widget: PropTypes.shape({
		namespace: PropTypes.string,
		props: PropTypes.object
	})
};
WidgetProvider.propTypes = {
	children: PropTypes.node.isRequired,
	namespace: PropTypes.string.isRequired
};


export default WidgetProvider;