import React from 'react';
import { justRender, justUnmountComponentAtNode } from 'react-union';
import ready from 'document-ready';

import Root from './components/Root';

const rootId = 'app-demo-root';

ready(() => {
	justRender(<Root />, rootId);

	if (window.Liferay) {
		window.Liferay.on('startNavigate', () => justUnmountComponentAtNode(rootId));
		window.Liferay.on('endNavigate', () => justRender(<Root />, rootId));
	}
});
