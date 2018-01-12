import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Widgets from './Widgets';

import { noop } from '../../utils';
import { RouteShape } from '../../shapes';
import scan from '../../scan';

/**
 * Renderes your widgets according to found DOM-marks and passed `routes`.
 * Widgets are encapsulated in one virtual DOM
 * even though widgets are distrubted over the HTML in different parts.
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
		onEndScan: PropTypes.func,
		/**
		 *  Called when there is an error while scanning of the HTML.
		 */
		onErrorScan: PropTypes.func,
		/**
		 * Called before the scan of the HTML
		 */
		onStartScan: PropTypes.func,
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
		onEndScan: noop,
		onErrorScan: noop,
		onStartScan: noop,
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
		const { onStartScan, onEndScan, onErrorScan, parent, routes } = props;

		onStartScan();

		const domParent = parent || document.body;

		scan(routes, domParent).then(
			configs => {
				onEndScan(configs);
				this.setState({ configs });
			},
			error => onErrorScan(error)
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
