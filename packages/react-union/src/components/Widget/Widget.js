import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { warning, invariant } from '../../utils';
import { ConfigShape } from '../../shapes';
import { withErrorBoundary } from '../../decorators';

import WidgetProvider from '../WidgetProvider';

/**
 * An internal component of `Union`.
 *
 * It renders a widget based on `descriptor` and `component` using React portals.
 * Provides context to the `component` with widget descriptor information.
 *
 * @see WidgetProvider
 */
export const Widget = ({ component: WidgetComponent, descriptor, render }) => {
	const { name, container, namespace, data } = descriptor;
	const resolvedNamespace = namespace || container;

	invariant(
		!WidgetComponent || container,
		`Missing attribute "container" for the widget "${name}" to be rendered.`
	);

	const widgetProps = { namespace: resolvedNamespace, data };

	const widgetElement = (
		<WidgetProvider {...widgetProps}>
			<WidgetComponent {...widgetProps} />
		</WidgetProvider>
	);

	if (render) {
		return render(widgetElement, container);
	}

	const domElement = document.getElementById(container);
	warning(domElement, `HTML element with ID "${container}" not found for widget "${name}"`);

	return domElement ? createPortal(widgetElement, domElement) : null;
};

Widget.propTypes = {
	...ConfigShape,
	render: PropTypes.func,
};

export default withErrorBoundary(Widget);
