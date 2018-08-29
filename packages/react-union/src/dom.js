import ReactDOM from 'react-dom';
import { createElementWithId } from './utils';

const DEFAULT_UNION_ROOT_ID = 'union';

export function justRender(reactElement, rootId = DEFAULT_UNION_ROOT_ID, resolve) {
	const domElement = createElementWithId(rootId, document.body);

	// TODO: clone reactElement and pass a special prop that must be passed to <Union />
	// if it does not get passed, it means that the application's <Root /> component looks like:
	// const Root = () => <Union routes={routes} />;
	// but it should look like:
	// const Root = props => <Union routes={routes} {...props} />;
	// because in react-union-ssr-server we need to pass `isServer` to <Union /> somehow
	// (React.createContext won't work, because in ssr-server it will be a different instance)
	ReactDOM.render(reactElement, domElement, resolve);
}

export function justUnmountComponentAtNode(rootId = DEFAULT_UNION_ROOT_ID) {
	const rootElement = document.getElementById(rootId);

	ReactDOM.unmountComponentAtNode(rootElement);
}
