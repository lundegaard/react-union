import forEach from 'ramda/src/forEach';
import contains from 'ramda/src/contains';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';

import { invariant } from './utils';

export const validateDescriptorStructures = forEach(({ name, namespace, container }) => {
	invariant(name, "Missing 'name' in the widget descriptor.");
	invariant(
		namespace || container,
		`Missing required attributes for the widget "${name}". ` +
			"Fill in the 'data-union-namespace' or 'data-union-container' in the widget descriptors."
	);
});

export const validateRoutesWithDescriptors = (routes, descriptors) => {
	const routePaths = map(prop('path'), routes);
	const descriptorNames = map(prop('name'), descriptors);

	forEach(
		descriptorName =>
			invariant(
				contains(descriptorName, routePaths),
				`Could not find a matching route for widget descriptor of name "${descriptorName}".`
			),
		descriptorNames
	);
};
