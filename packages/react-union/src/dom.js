import ReactDOM from 'react-dom';
import { createElementWithId, noop } from './utils';

const DEFAULT_UNION_ROOT_ID = 'union';

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

export function justUnmountComponentAtNode(component, rootId = DEFAULT_UNION_ROOT_ID) {
	const rootElement = document.getElementById(rootId);

	ReactDOM.unmountComponentAtNode(rootElement);
}
