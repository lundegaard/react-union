import ReactDOM from 'react-dom';
import { createElementWithId } from './utils';

const DEFAULT_UNION_ROOT_ID = 'union';

export function justRender(reactElement, rootId = DEFAULT_UNION_ROOT_ID, resolve) {
	const domElement = createElementWithId(rootId, document.body);
	// TODO: Use ReactDOM.hydrate once React supports hydration of portals.
	// https://github.com/facebook/react/issues/13097
	const render = ReactDOM[window.__HYDRATE__ ? 'render' : 'render'];
	render(reactElement, domElement, resolve);
}

export function justUnmountComponentAtNode(rootId = DEFAULT_UNION_ROOT_ID) {
	const rootElement = document.getElementById(rootId);

	ReactDOM.unmountComponentAtNode(rootElement);
}
