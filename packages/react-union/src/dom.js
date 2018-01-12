import ReactDOM from 'react-dom';
import { createElementWithId } from './utils';

const DEFAULT_UNION_ROOT_ID = 'union';

export function justRender(component, rootId = DEFAULT_UNION_ROOT_ID, resolve) {
	const rootElement = createElementWithId(rootId, document.body);

	ReactDOM.render(component, rootElement, resolve);
}

export function justUnmountComponentAtNode(component, rootId = DEFAULT_UNION_ROOT_ID) {
	const rootElement = document.getElementById(rootId);

	ReactDOM.unmountComponentAtNode(rootElement);
}
