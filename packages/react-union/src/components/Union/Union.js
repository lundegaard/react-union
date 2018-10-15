import PropTypes from 'prop-types';
import React, { Component, StrictMode, Fragment } from 'react';

import { noop } from '../../utils';
import { RouteShape } from '../../shapes';
import scan from '../../scan';

import Widget from '../Widget';

/**
 * Renders your widgets according to found widget descriptors and passed `routes`.
 * Widgets are encapsulated in a single virtual DOM even though they may be spread out
 * in the actual mark-up.
 */
class Union extends Component {
	static propTypes = {
		/**
		 * Children of the `Union` component.
		 */
		children: PropTypes.node,
		/**
		 * Called after the scan of the HTML is done.
		 */
		onScanEnd: PropTypes.func,
		/**
		 *  Called when there is an error while scanning of the HTML.
		 */
		onScanError: PropTypes.func,
		/**
		 * Called before the scan of the HTML
		 */
		onScanStart: PropTypes.func,
		/**
		 * Element in which the scan is running. By default `document`.
		 */
		parent: PropTypes.object,
		/**
		 *  Array of routes that are supported by your application.
		 */
		routes: PropTypes.arrayOf(PropTypes.shape(RouteShape)).isRequired,
		/**
		 * Enable React.Strict mode. By default `true`
		 */
		strictMode: PropTypes.bool,
	};

	static defaultProps = {
		onScanEnd: noop,
		onScanError: noop,
		onScanStart: noop,
		strictMode: true,
	};

	state = {
		configs: [],
		commonData: null,
	};

	componentDidMount() {
		this.scan(this.props);
	}

	componentDidUpdate(prevProps) {
		const { routes } = this.props;
		if (prevProps.routes !== routes) {
			this.scan(prevProps);
		}
	}

	scan = props => {
		const { onScanStart, onScanEnd, onScanError, parent, routes } = props;

		onScanStart();

		const domParent = parent || document;

		scan(routes, domParent).then(
			result => {
				onScanEnd(result);
				this.setState(result);
			},
			error => onScanError(error)
		);
	};

	renderWidget = config => (
		<Widget key={config.descriptor.namespace || config.descriptor.container} {...config} />
	);

	// eslint-disable-next-line react/destructuring-assignment
	resolveStrictMode = union => (this.props.strictMode ? <StrictMode>{union}</StrictMode> : union);

	render() {
		const { children } = this.props;
		const { configs } = this.state;

		return this.resolveStrictMode(
			<Fragment>
				{children}
				{configs.map(this.renderWidget)}
			</Fragment>
		);
	}
}

export default Union;
