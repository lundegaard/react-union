import PropTypes from 'prop-types';
import React, { Component, StrictMode, Fragment } from 'react';

import { noop } from '../../utils';
import { RouteShape } from '../../shapes';
import scan from '../../scanning';

import Widget from '../Widget';

/**
 * Renders your widgets according to found widget descriptors and passed `routes`.
 * Widgets are encapsulated in a single virtual DOM even though they may be spread out
 * in the actual mark-up.
 */
class Union extends Component {
	static propTypes = {
		/**
		 * Cheerio instance for SSR.
		 */
		$: PropTypes.any,
		/**
		 * Children of the `Union` component.
		 */
		children: PropTypes.node,
		/**
		 * If true, the scanning will begin in the constructor instead of `componentDidMount`.
		 */
		isServer: PropTypes.bool,
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
		 * Called instead of the default `createPortal` function.
		 */
		renderWidget: PropTypes.func,
		/**
		 * Array of routes that are supported by your application.
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
		parent: document && document.body,
		strictMode: true,
	};

	state = {
		configs: this.props.isServer ? this.scan(props) : [],
	};

	componentDidMount() {
		// NOTE: This is not wrong. We need to initialize the scanning after the component mounts.
		// eslint-disable-next-line react/no-did-mount-set-state
		this.setState({
			configs: this.scan(this.props),
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.routes !== this.props.routes) {
			this.setState({
				configs: this.scan(this.props),
			});
		}
	}

	scan = props => {
		const { $, onScanStart, onScanEnd, onScanError, parent, routes } = props;

		try {
			onScanStart();
			const configs = scan(routes, $ || parent);
			onScanEnd(configs);

			return configs;
		} catch (error) {
			onScanError(error);

			return [];
		}
	};

	renderWidget = config => (
		<Widget
			key={config.descriptor.namespace || config.descriptor.container}
			render={this.props.renderWidget}
			{...config}
		/>
	);

	resolveStrictMode = union => (this.props.strictMode ? <StrictMode>{union}</StrictMode> : union);

	render() {
		return this.resolveStrictMode(
			<Fragment>
				{this.props.children}
				{this.state.configs.map(this.renderWidget)}
			</Fragment>
		);
	}
}

export default Union;
