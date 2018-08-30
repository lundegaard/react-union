import PropTypes from 'prop-types';
import React, { Component, StrictMode, Fragment } from 'react';

import { noop, invariant } from '../../utils';
import { RouteShape } from '../../shapes';
import scan from '../../scanning';
import { withRenderingContext } from '../../decorators';

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
		 * Whether the component is rendered in SSR context. Passed by `withRenderingContext`.
		 */
		isServer: PropTypes.bool.isRequired,
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
		 * HTML element or Cheerio wrapper in which the scan is running. By default `document`.
		 */
		parent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
		/**
		 * Array of routes that are supported by your application.
		 */
		routes: PropTypes.arrayOf(PropTypes.shape(RouteShape)),
		/**
		 * SSR scan result which may be passed by `withRenderingContext`.
		 */
		scanResult: PropTypes.object,
		/**
		 * Enable React.Strict mode. By default `true`
		 */
		strictMode: PropTypes.bool,
	};

	static defaultProps = {
		isServer: false,
		onScanEnd: noop,
		onScanError: noop,
		onScanStart: noop,
		parent: document,
		strictMode: true,
	};

	static scan = props => {
		const { onScanStart, onScanEnd, onScanError, parent, routes } = props;

		try {
			onScanStart();
			const scanResult = scan(routes, parent);
			onScanEnd(scanResult);

			return scanResult;
		} catch (error) {
			onScanError(error);

			throw error;
		}
	};

	static getDerivedStateFromProps(nextProps, previousState) {
		if (previousState.routes !== nextProps.routes) {
			return {
				scanResult: Union.scan(nextProps),
				routes: nextProps.routes,
			};
		}

		return null;
	}

	state = {
		// NOTE: We never work with `this.state.routes`, this is because of getDerivedStateFromProps.
		routes: this.props.routes,
		scanResult: this.getInitialScanResult(),
	};

	componentDidMount() {
		// NOTE: This is not wrong. We need to initialize the scanning after the component mounts.
		// eslint-disable-next-line react/no-did-mount-set-state
		this.setState({ scanResult: Union.scan(this.props) });
	}

	getInitialScanResult() {
		return (
			this.props.scanResult ||
			(this.props.isServer ? Union.scan(this.props) : { commonData: {}, configs: [] })
		);
	}

	renderWidget = config => (
		<Widget
			isServer={this.props.isServer}
			key={config.descriptor.namespace || config.descriptor.container}
			{...config}
		/>
	);

	resolveStrictMode = union => (this.props.strictMode ? <StrictMode>{union}</StrictMode> : union);

	render() {
		const { isServer, routes } = this.props;

		invariant(
			isServer !== Boolean(routes),
			isServer
				? 'You should not be passing `routes` to <Union /> in the SSR context. ' +
				  'Instead, you should pass them to the `render` function in the SSR request handler.'
				: 'Missing `routes` prop in <Union />.'
		);

		return this.resolveStrictMode(
			<Fragment>
				{this.props.children}
				{this.state.scanResult.configs.map(this.renderWidget)}
			</Fragment>
		);
	}
}

export default withRenderingContext(Union);
