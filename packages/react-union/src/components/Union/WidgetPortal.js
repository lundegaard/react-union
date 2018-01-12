import React from 'react';
import { createPortal } from 'react-dom';

import { warning, invariant } from '../../utils';
import { ConfigShape } from '../../shapes';

import WidgetProvider from '../WidgetProvider';

/**
 * Internal component of `Union`.
 * It renders React portals according to `mark` and `component`.
 *
 * Provides context to the `component` with mark informations.
 *
 * @See `WidgetProvider`.
 */
const WidgetPortal = ({ component: WidgetComponent, mark }) => {
	const { name, container, namespace, data } = mark;
	const resolvedNamespace = namespace || container;

	invariant(
		!WidgetComponent || container,
		`Missing attribute "container" for the widget "${name}" to be rendered.`
	);

	const widgetProps = { namespace: resolvedNamespace, data };
	const el = document.getElementById(container);

	warning(el, `HTML container with id "${container}" is not found for widget wtih name "${name}"`);

	return WidgetComponent && el
		? createPortal(
			<WidgetProvider {...widgetProps}>
				<WidgetComponent {...widgetProps} />
			</WidgetProvider>,
			el
		)
		: null;
};

WidgetPortal.propTypes = {
	...ConfigShape,
};

export default WidgetPortal;
