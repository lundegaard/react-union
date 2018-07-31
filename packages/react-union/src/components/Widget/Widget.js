import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { warning, invariant } from '../../utils';
import { ConfigShape } from '../../shapes';
import { withErrorBoundary } from '../../decorators';
import { WidgetContext } from '../../contexts';

/**
 * An internal component of `Union`.
 *
 * It renders a widget based on `descriptor` and `component` using React portals.
 * Provides context to the `component` with widget descriptor information.
 *
 */
export const Widget = ({ component: WidgetComponent, descriptor, isServer }) => {
	const { widget, container, namespace, data } = descriptor;
	const resolvedNamespace = namespace || container;

	invariant(
		!WidgetComponent || container,
		`Missing attribute "container" for the widget "${widget}" to be rendered.`
	);

	const widgetProps = { data, namespace: resolvedNamespace };

	const widgetElement = (
		<WidgetContext.Provider value={widgetProps}>
			<WidgetComponent {...widgetProps} />
		</WidgetContext.Provider>
	);

	if (isServer) {
		return <div data-union-portal={container}>{widgetElement}</div>;
	}

	const domElement = document.getElementById(container);
	warning(domElement, `HTML element with ID "${container}" not found for widget "${widget}"`);

	return domElement ? createPortal(widgetElement, domElement) : null;
};

Widget.propTypes = {
	...ConfigShape,
	isServer: PropTypes.bool.isRequired,
};

export default withErrorBoundary(Widget);
