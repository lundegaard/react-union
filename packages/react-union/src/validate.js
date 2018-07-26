import forEach from 'ramda/src/forEach';
import contains from 'ramda/src/contains';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';

import { invariant } from './utils';

export const validateDescriptorStructures = forEach(({ widget, namespace, container }) => {
	invariant(widget, 'Missing data-union-widget value in the widget descriptor.');

	invariant(
		namespace || container,
		`Missing required attributes for the widget "${widget}". ` +
			"Fill in the 'data-union-namespace' or 'data-union-container' in the widget descriptors."
	);
});

export const validateRoutesWithDescriptors = (routes, descriptors) => {
	const routePaths = map(prop('path'), routes);
	const widgetNames = map(prop('widget'), descriptors);

	forEach(
		widgetName =>
			invariant(
				contains(widgetName, routePaths),
				`Could not find a matching route for widget descriptor of widget "${widgetName}".`
			),
		widgetNames
	);
};
