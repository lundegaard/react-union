import always from 'ramda/src/always';

export var warning = function warning(pred, msg) {
	if (pred) {
		return;
	}

	if (process.env.NODE_ENV === 'production') {
		return;
	}

	console.log(msg);
};

export var invariant = function invariant(pred, msg) {
	if (pred) {
		return;
	}

	if (process.env.NODE_ENV === 'production') {
		throw new Error('There was an error. Use non-production build to see details.');
	}

	throw new Error(msg);
};

export var createElement = function createElement(id, parent, elementType) {
	var newElement = document.createElement(elementType);
	var idAttr = document.createAttribute('id');
	idAttr.value = id;

	newElement.setAttributeNode(idAttr);
	parent.appendChild(newElement);

	return newElement;
};

export var createElementWithId = function createElementWithId(id, parent) {
	var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'div';

	var element = document.getElementById(id);

	return element ? element : createElement(id, parent, elementType);
};

export var noop = always(null);