import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import always from 'ramda/src/always';
import reduce from 'ramda/src/reduce';
import mergeDeepRight from 'ramda/src/mergeDeepRight';
import memoizeWith from 'ramda/src/memoizeWith';
import prop from 'ramda/src/prop';
import ifElse from 'ramda/src/ifElse';
import contains from 'ramda/src/contains';
import o from 'ramda/src/o';
import reject from 'ramda/src/reject';
import isNil from 'ramda/src/isNil';

import { INVALID_JSON } from './constants';

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

const rejectNil = reject(isNil);

export const mergeData = ifElse(
	contains(INVALID_JSON),
	always(INVALID_JSON),
	o(mergeDeepRightAll, rejectNil)
);

export const memoizedClearContent = memoizeWith(prop('id'), element => (element.innerHTML = ''));

export const createContextDecorator = (Context, displayName) => NextComponent => {
	const Decorator = props => (
		<Context.Consumer>{value => <NextComponent {...props} {...value} />}</Context.Consumer>
	);

	hoistNonReactStatics(Decorator, NextComponent);
	Decorator.displayName = `With${displayName}(${getDisplayName(NextComponent)})`;

	return Decorator;
};
