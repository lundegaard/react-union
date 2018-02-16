import forEach from 'ramda/src/forEach';
import { invariant } from './utils';

export default forEach(({ name, namespace, container }) => {
	invariant(name, "Missing 'name' in the widget descriptor.");
	invariant(
		namespace || container,
		`Missing required attributes for the widget "${name}". ` +
			"Fill in the 'data-union-namespace' or 'data-union-container' in the widget descriptors."
	);
});
