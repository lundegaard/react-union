import always from 'ramda/src/always';
import reduce from 'ramda/src/reduce';
import mergeDeepRight from 'ramda/src/mergeDeepRight';

export const warning = (pred, msg) => {
	if (pred) {
		return;
	}

	if (process.env.NODE_ENV === 'production') {
		return;
	}

	console.log(msg);
};

export const invariant = (pred, msg) => {
	if (pred) {
		return;
	}

	if (process.env.NODE_ENV === 'production') {
		throw new Error('There was an error. Use non-production build to see details.');
	}

	throw new Error(msg);
};

export const createElement = (id, parent, elementType) => {
	const newElement = document.createElement(elementType);
	const idAttr = document.createAttribute('id');
	idAttr.value = id;

	newElement.setAttributeNode(idAttr);
	parent.appendChild(newElement);

	return newElement;
};

export const createElementWithId = (id, parent, elementType = 'div') => {
	const element = document.getElementById(id);

	return element ? element : createElement(id, parent, elementType);
};

export const getDisplayName = Component => Component.displayName || Component.name || 'Component';

export const noop = always(null);

export const mergeDeepRightAll = reduce(mergeDeepRight, {});
