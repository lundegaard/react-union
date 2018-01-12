'use strict';

exports.__esModule = true;
exports.noop = exports.createElementWithId = exports.createElement = exports.invariant = exports.warning = undefined;

var _always = require('ramda/src/always');

var _always2 = _interopRequireDefault(_always);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var warning = exports.warning = function warning(pred, msg) {
	if (pred) {
		return;
	}

	if (process.env.NODE_ENV === 'production') {
		return;
	}

	console.log(msg);
};

var invariant = exports.invariant = function invariant(pred, msg) {
	if (pred) {
		return;
	}

	if (process.env.NODE_ENV === 'production') {
		throw new Error('There was an error. Use non-production build to see details.');
	}

	throw new Error(msg);
};

var createElement = exports.createElement = function createElement(id, parent, elementType) {
	var newElement = document.createElement(elementType);
	var idAttr = document.createAttribute('id');
	idAttr.value = id;

	newElement.setAttributeNode(idAttr);
	parent.appendChild(newElement);

	return newElement;
};

var createElementWithId = exports.createElementWithId = function createElementWithId(id, parent) {
	var elementType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'div';

	var element = document.getElementById(id);

	return element ? element : createElement(id, parent, elementType);
};

var noop = exports.noop = (0, _always2.default)(null);