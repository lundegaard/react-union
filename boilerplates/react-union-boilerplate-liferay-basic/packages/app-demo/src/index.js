import '@babel/polyfill';
import React from 'react';
import { justRender, justUnmountComponentAtNode } from 'react-union';
import { AppContainer } from 'react-hot-loader';
import ready from 'document-ready';

import Root from './components/Root';

const render = () => justRender(<Root />);

ready(() => {
	render();

	if (window.Liferay) {
		window.Liferay.on('startNavigate', justUnmountComponentAtNode);
		window.Liferay.on('endNavigate', render);
	}
});
