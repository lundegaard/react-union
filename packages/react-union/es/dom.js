import ReactDOM from 'react-dom';
import { createElementWithId } from './utils';

var DEFAULT_UNION_ROOT_ID = 'union';

export function justRender(component) {
	var rootId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNION_ROOT_ID;
	var resolve = arguments[2];

	var rootElement = createElementWithId(rootId, document.body);

	ReactDOM.render(component, rootElement, resolve);
}

export function justUnmountComponentAtNode(component) {
	var rootId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNION_ROOT_ID;

	var rootElement = document.getElementById(rootId);

	ReactDOM.unmountComponentAtNode(rootElement);
}