import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// HACK: Sadly, React does not support hydration of portals. This works!
const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;

class Portal extends React.Component {
	static propTypes = {
		/**
		 * Children that will be warped to the `to` HTML element.
		 */
		children: PropTypes.element.isRequired,
		/**
		 * HTML element of HTML element to which the `children` will be warped.
		 */
		to: PropTypes.object.isRequired,
	};

	componentDidMount() {
		this.renderPortal(this.props);
	}

	componentWillUnmount() {
		this.removePortal(this.props);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.to !== this.props.to) {
			this.removePortal(this.props);
		}

		this.renderPortal(nextProps);
	}

	removePortal = props => {
		ReactDOM.unmountComponentAtNode(props.to);
	};

	renderPortal = props => {
		renderSubtreeIntoContainer(this, props.children, props.to);
	};

	render() {
		return null;
	}
}

export default Portal;
