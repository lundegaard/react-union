import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { noop } from '../../utils';
import { RouteShape } from '../../shapes';
import scan from '../../scan';

import Widgets from '../Widgets';

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
		 * Element in which the scan is running. By default `document.body`.
		 */
		parent: PropTypes.object,
		/**
		 *  Array of routes that are supported by your application.
		 */
		routes: PropTypes.arrayOf(PropTypes.shape(RouteShape)).isRequired,
	};

	static defaultProps = {
		onScanEnd: noop,
		onScanError: noop,
		onScanStart: noop,
	};

	state = {
		configs: [],
	};

	componentDidMount() {
		this.scan(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.routes !== this.props.routes) {
			this.scan(nextProps);
		}
	}

	scan(props) {
		const { onScanStart, onScanEnd, onScanError, parent, routes } = props;

		onScanStart();

		const domParent = parent || document.body;

		scan(routes, domParent).then(
			configs => {
				onScanEnd(configs);
				this.setState({ configs });
			},
			error => onScanError(error)
		);
	}

	render() {
		return (
			<div>
				{this.props.children}
				<Widgets configs={this.state.configs} />
			</div>
		);
	}
}

export default Union;
