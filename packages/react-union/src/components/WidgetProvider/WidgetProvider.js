import PropTypes from 'prop-types';
import { Component, Children } from 'react';

/**
 * Adds the supplied widget data and namespace to the React context.
 */
class WidgetProvider extends Component {
	static childContextTypes = {
		widget: PropTypes.shape({
			namespace: PropTypes.string,
			data: PropTypes.object,
		}),
	};

	static propTypes = {
		/**
		 * Renders children
		 */
		children: PropTypes.node.isRequired,
		/**
		 * Data passed in the widget descriptor
		 */
		data: PropTypes.object,
		/**
		 * Unique string for the instance of `children`
		 */
		namespace: PropTypes.string.isRequired,
	};

	getChildContext() {
		return {
			widget: {
				namespace: this.props.namespace,
				data: this.props.data,
			},
		};
	}

	render() {
		return Children.only(this.props.children);
	}
}

export default WidgetProvider;
