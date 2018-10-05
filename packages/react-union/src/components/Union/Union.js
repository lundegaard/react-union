import PropTypes from 'prop-types';
import React, { Component, StrictMode, Fragment } from 'react';
import map from 'ramda/src/map';
import path from 'ramda/src/path';

import { noop, invariant } from '../../utils';
import { RouteShape, WidgetConfigShape } from '../../shapes';
import scan from '../../scanning';
import createWidgetConfigs from '../../routing';
import { withServerContext } from '../../decorators';

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
		 * Initial props retrieved by the SSR server. Passed by `withServerContext`.
		 */
		initialProps: PropTypes.objectOf(PropTypes.object),
		/**
		 * Whether the component is rendered in SSR context. Passed by `withServerContext`.
		 */
		isServer: PropTypes.bool.isRequired,
		/**
		 * Called after the scan of the HTML is successfully done.
		 */
		onScanEnd: PropTypes.func,
		/**
		 * Called when there is an error while scanning of the HTML.
		 */
		onScanError: PropTypes.func,
		/**
		 * Called before the scan of the HTML.
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
		 * Enable React.Strict mode. By default `true`.
		 */
		strictMode: PropTypes.bool,
		/**
		 * Widget configs retrieved by the SSR server. Passed by `withServerContext`.
		 */
		widgetConfigs: PropTypes.arrayOf(PropTypes.shape(WidgetConfigShape)),
	};

	static defaultProps = {
		isServer: false,
		onScanEnd: noop,
		onScanError: noop,
		onScanStart: noop,
		parent: typeof document !== 'undefined' ? document : null,
		strictMode: true,
	};

	static scan = props => {
		const { onScanStart, onScanEnd, onScanError, parent, routes } = props;

		invariant(routes, 'Missing `routes` prop in <Union />.');

		try {
			onScanStart();
			const scanResult = scan(parent);
			const { commonData } = scanResult;
			const widgetConfigs = createWidgetConfigs(routes, scanResult);
			onScanEnd({ commonData, scanResult, widgetConfigs });

			return widgetConfigs;
		} catch (error) {
			onScanError(error);

			throw error;
		}
	};

	static getDerivedStateFromProps(nextProps, previousState) {
		if (previousState.routes !== nextProps.routes) {
			return {
				routes: nextProps.routes,
				widgetConfigs: Union.scan(nextProps),
			};
		}

		return null;
	}

	state = {
		// NOTE: We never work with `this.state.routes`, this is because of getDerivedStateFromProps.
		routes: this.props.routes,
		widgetConfigs: this.getInitialWidgetConfigs(),
	};

	// NOTE: not an arrow function because we want to call it in `state` property initializer
	getInitialWidgetConfigs() {
		if (this.props.isServer) {
			return this.props.widgetConfigs || Union.scan(this.props);
		}

		return window.__SCAN_RESULT__
			? createWidgetConfigs(this.props.routes, window.__SCAN_RESULT__)
			: Union.scan(this.props);
	}

	renderWidget = widgetConfig => {
		const initialProps = this.props.isServer ? this.props.initialProps : window.__INITIAL_PROPS__;

		return (
			<Widget
				config={widgetConfig}
				initialProps={path([widgetConfig.namespace], initialProps)}
				isServer={this.props.isServer}
				key={widgetConfig.namespace}
			/>
		);
	};

	resolveStrictMode = union => (this.props.strictMode ? <StrictMode>{union}</StrictMode> : union);

	render() {
		return this.resolveStrictMode(
			<Fragment>
				{this.props.children}
				{map(this.renderWidget, this.state.widgetConfigs)}
			</Fragment>
		);
	}
}

export default withServerContext(Union);
