import React from 'react';
import { createPortal } from 'react-dom';

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
const Widget = ({ component: WidgetComponent, descriptor }) => {
	const { name, container, namespace, data } = descriptor;
	const resolvedNamespace = namespace || container;

	invariant(
		!WidgetComponent || container,
		`Missing attribute "container" for the widget "${name}" to be rendered.`
	);

	const widgetProps = { namespace: resolvedNamespace, data };
	const element = document.getElementById(container);

	warning(element, `HTML element with ID "${container}" not found for widget "${name}"`);

	return WidgetComponent && element
		? createPortal(
			<WidgetProvider {...widgetProps}>
				<WidgetComponent {...widgetProps} />
			</WidgetProvider>,
			element
		)
		: null;
};

Widget.propTypes = ConfigShape;

export default withErrorBoundary(Widget);
