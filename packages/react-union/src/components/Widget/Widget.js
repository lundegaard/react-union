import React from 'react';
import { createPortal } from 'react-dom';

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
const Widget = ({ commonData, component: WidgetComponent, descriptor }) => {
	const { widget, container, namespace, data } = descriptor;
	const resolvedNamespace = namespace || container;

	invariant(
		!WidgetComponent || container,
		`Missing attribute "container" for the widget "${widget}" to be rendered.`
	);

	const widgetProps = {
		data,
		namespace: resolvedNamespace,
		// NOTE: prop renamed to discourage use in widget source code
		// people should use `data` instead to allow for widget-specific overriding
		rawCommonData: commonData,
	};

	const element = document.getElementById(container);

	warning(element, `HTML element with ID "${container}" not found for widget "${widget}"`);

	return WidgetComponent && element
		? createPortal(
				<WidgetContext.Provider value={widgetProps}>
					<WidgetComponent {...widgetProps} />
				</WidgetContext.Provider>,
				element
		  )
		: null;
};

Widget.propTypes = ConfigShape;

export { Widget };

export default withErrorBoundary(Widget);
