import ReactDOM from 'react-dom';
import { noop } from 'ramda-extension';

import { RESCAN } from './constants';

const DEFAULT_UNION_ROOT_ID = 'union';

const createElement = (id, parent, elementType) => {
	const newElement = document.createElement(elementType);
	const idAttribute = document.createAttribute('id');
	idAttribute.value = id;

	newElement.setAttributeNode(idAttribute);
	parent.appendChild(newElement);

	return newElement;
};

const createElementWithId = (id, parent, elementType = 'div') => {
	const element = document.getElementById(id);

	return element ? element : createElement(id, parent, elementType);
};

export function justRender(reactElement, rootId = DEFAULT_UNION_ROOT_ID, resolve = noop) {
	const domElement = createElementWithId(rootId, document.body);

	if (window.__HYDRATE__) {
		// NOTE: We do not want to hydrate twice.
		delete window.__HYDRATE__;
		// TODO: Use ReactDOM.hydrate once React supports hydration of portals.
		// https://github.com/facebook/react/issues/13097
		ReactDOM.render(reactElement, domElement, resolve);
	}

	ReactDOM.render(reactElement, domElement, resolve);
}

export function justUnmountComponentAtNode(rootId = DEFAULT_UNION_ROOT_ID) {
	const rootElement = document.getElementById(rootId);

	ReactDOM.unmountComponentAtNode(rootElement);
}

export const rescan = () => {
	const event = document.createEvent('Event');
	event.initEvent(RESCAN, true, true);
	document.dispatchEvent(event);
};
