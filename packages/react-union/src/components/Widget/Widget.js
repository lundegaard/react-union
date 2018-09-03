import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { warning, invariant } from '../../utils';
import { ConfigShape } from '../../shapes';
import { withErrorBoundary } from '../../decorators';
import { WidgetContext } from '../../contexts';

import Portal from '../Portal';

/**
 * An internal component of `Union`.
 *
 * It renders a widget based on `descriptor` and `component` using React portals.
 * Provides context to the `component` with widget descriptor information.
 *
 */
export class Widget extends Component {
	static propTypes = {
		config: PropTypes.shape(ConfigShape).isRequired,
		isServer: PropTypes.bool.isRequired,
	};

	state = {
		initialProps: null,
	};

	componentDidMount() {
		if (!this.props.config.initialProps) {
			this.getInitialProps();
		}
	}

	getInitialProps = async () => {
		const { config } = this.props;
		const { getInitialProps } = config.component;

		if (getInitialProps) {
			const initialProps = await getInitialProps({ config });
			this.setState({ initialProps });
		}
	};

	render() {
		const { config, isServer } = this.props;
		const { component: WidgetComponent, descriptor } = config;
		const { widget, container, namespace, data } = descriptor;
		const resolvedNamespace = namespace || container;

		invariant(
			!WidgetComponent || container,
			`Missing attribute "container" for the widget "${widget}" to be rendered.`
		);

		const widgetProps = {
			data,
			isServer,
			namespace: resolvedNamespace,
		};

		// NOTE: on the server, this.state.initialProps is always null
		// on the client, state contains client-side initialProps and props contain server-side ones
		const initialProps = this.state.initialProps || this.props.config.initialProps;

		const widgetElement = (
			<WidgetContext.Provider value={widgetProps}>
				<WidgetComponent {...widgetProps} {...initialProps} />
			</WidgetContext.Provider>
		);

		if (isServer) {
			return <div data-union-portal={container}>{widgetElement}</div>;
		}

		const domElement = document.getElementById(container);
		warning(domElement, `HTML element with ID "${container}" not found for widget "${widget}"`);

		if (!domElement) {
			return null;
		}

		return <Portal to={domElement}>{widgetElement}</Portal>;
	}
}

export default withErrorBoundary(Widget);
