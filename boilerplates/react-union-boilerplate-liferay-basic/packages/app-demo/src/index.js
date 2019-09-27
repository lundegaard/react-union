import React from 'react';
import { justRender, justUnmountComponentAtNode } from 'react-union';
import ready from 'document-ready';

import Root from './components/Root';

ready(() => {
	justRender(<Root />);

	if (window.Liferay) {
		window.Liferay.on('startNavigate', () => justUnmountComponentAtNode());
		window.Liferay.on('endNavigate', () => justRender(<Root />));
	}
});
