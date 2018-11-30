import PropTypes from 'prop-types';
import React, { Component, StrictMode, Fragment } from 'react';
import { map, path } from 'ramda';
import { noop } from 'ramda-extension';

import { invariant } from '../../utils';
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

	constructor(props, context) {
		super(props, context);

		this.state = {
			routesReference: props.routes,
			widgetConfigs: props.widgetConfigs || Union.scan(props),
		};
	}

	renderWidget = widgetConfig => {
		const { initialProps } = this.props;

		return (
			<Widget
				config={widgetConfig}
				initialProps={path([widgetConfig.namespace], initialProps)}
				key={widgetConfig.namespace}
			/>
		);
	};

	resolveStrictMode = element => {
		const { strictMode } = this.props;

		return strictMode ? <StrictMode>{element}</StrictMode> : element;
	};

	render() {
		const { children } = this.props;
		const { widgetConfigs } = this.state;

		return this.resolveStrictMode(
			<Fragment>
				{children}
				{map(this.renderWidget, widgetConfigs)}
			</Fragment>
		);
	}
}

export default withPrescanContext(Union);
