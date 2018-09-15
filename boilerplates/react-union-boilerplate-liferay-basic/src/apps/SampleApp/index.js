import '@babel/polyfill';
import React from 'react';
import { justRender, justUnmountComponentAtNode } from 'react-union';
import ready from 'document-ready';

import Root from './components/Root';

const renderRoot = () => justRender(<Root />);

ready(() => {
	renderRoot();

	if (window.Liferay) {
		window.Liferay.on('startNavigate', justUnmountComponentAtNode);
		window.Liferay.on('endNavigate', renderRoot);
	}
});
