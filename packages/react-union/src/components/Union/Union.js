import PropTypes from 'prop-types';
import React, { Component, StrictMode, Fragment } from 'react';
import map from 'ramda/src/map';
import path from 'ramda/src/path';

import { noop, invariant } from '../../utils';
import { RouteShape, WidgetConfigShape } from '../../shapes';
import scan from '../../scanning';
import route from '../../routing';
import { withPrescanContext } from '../../decorators';
import { IS_SERVER } from '../../constants';

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
		 * Pre-scanned initial props.
		 */
		initialProps: PropTypes.objectOf(PropTypes.object),
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
		 * Pre-scanned widget configs.
		 */
		widgetConfigs: PropTypes.arrayOf(PropTypes.shape(WidgetConfigShape)),
	};

	static defaultProps = {
		onScanEnd: noop,
		onScanError: noop,
		onScanStart: noop,
		parent: IS_SERVER ? null : document,
		strictMode: true,
	};

	static scan = props => {
		const { onScanStart, onScanEnd, onScanError, parent, routes } = props;

		invariant(routes, 'Missing `routes` prop in <Union />.');

		try {
			onScanStart();
			const scanResult = scan(parent);
			const routeResult = route(routes, scanResult);
			onScanEnd(routeResult);

			return routeResult.widgetConfigs;
		} catch (error) {
			onScanError(error);

			throw error;
		}
	};

	static getDerivedStateFromProps(nextProps, previousState) {
		if (previousState.routesReference !== nextProps.routes) {
			return {
				routesReference: nextProps.routes,
				widgetConfigs: Union.scan(nextProps),
			};
		}

		return null;
	}

	state = {
		routesReference: this.props.routes,
		widgetConfigs: this.props.widgetConfigs || Union.scan(this.props),
	};

	renderWidget = widgetConfig => (
		<Widget
			config={widgetConfig}
			initialProps={path([widgetConfig.namespace], this.props.initialProps)}
			key={widgetConfig.namespace}
		/>
	);

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

export default withPrescanContext(Union);
