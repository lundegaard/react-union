import PropTypes from 'prop-types';
import { Component, Children } from 'react';

/**
 * Adds the context to the component with `mark` key `widget`.
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
		 * Renders children.
		 */
		children: PropTypes.node.isRequired,
		/**
		 * Data passed through DOM-mark
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
