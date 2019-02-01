import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { map, path } from 'ramda';
import { noop } from 'ramda-extension';

import { invariant } from '../../utils';
import { RouteShape } from '../../shapes';
import scan from '../../scanning';
import route from '../../routing';
import { IS_SERVER, RESCAN } from '../../constants';
import { PrescanContext } from '../../contexts';

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
		 * Called after the scan of the HTML is successfully done.
		 */
		onScanEnd: PropTypes.func,
		/**
		 * Called when an error happens while scanning the HTML.
		 */
		onScanError: PropTypes.func,
		/**
		 * Called before the scan of the HTML.
		 */
		onScanStart: PropTypes.func,
		/**
		 * HTML element or Cheerio wrapper in which the scan is running. Defaults to `document`.
		 */
		parent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
		/**
		 * Array of routes that are supported by your application.
		 */
		routes: PropTypes.arrayOf(PropTypes.shape(RouteShape)),
	};

	static contextType = PrescanContext;

	static defaultProps = {
		onScanEnd: noop,
		onScanError: noop,
		onScanStart: noop,
		parent: IS_SERVER ? null : document,
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
		const { widgetConfigs } = this.context || {};

		this.state = {
			routesReference: props.routes,
			widgetConfigs: widgetConfigs || Union.scan(props),
		};
	}

	componentDidMount() {
		document.addEventListener(RESCAN, this.rescan);
	}

	componentWillUnmount() {
		document.removeEventListener(RESCAN, this.rescan);
	}

	rescan = () =>
		this.setState({
			widgetConfigs: Union.scan(this.props),
		});

	renderWidget = widgetConfig => {
		const { initialProps } = this.context || {};

		return (
			<Widget
				config={widgetConfig}
				initialProps={path([widgetConfig.namespace], initialProps)}
				key={widgetConfig.namespace}
			/>
		);
	};

	render() {
		const { children } = this.props;
		const { widgetConfigs } = this.state;

		return (
			<Fragment>
				{children}
				{map(this.renderWidget, widgetConfigs)}
			</Fragment>
		);
	}
}

export default Union;
