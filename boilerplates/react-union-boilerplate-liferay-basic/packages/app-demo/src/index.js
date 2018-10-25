import '@babel/polyfill';
import React from 'react';
import { justRender, justUnmountComponentAtNode } from 'react-union';
import { AppContainer } from 'react-hot-loader';
import ready from 'document-ready';

import Root from './components/Root';

const render = Component =>
	justRender(
		<AppContainer errorReporter={__DEV__ ? require('redbox-react').default : null}>
			<Component />
		</AppContainer>
	);

const rerenderContainer = () => {
	const NextRoot = require('./components/Root').default;
	render(NextRoot);
};

ready(() => {
	render(Root);

	if (window.Liferay) {
		window.Liferay.on('startNavigate', justUnmountComponentAtNode);
		window.Liferay.on('endNavigate', rerenderContainer);
	}
});

if (module.hot) {
	module.hot.accept(['./components/Root'], rerenderContainer);
}
