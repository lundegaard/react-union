import React from 'react';
import { justRender } from 'react-union';
import { AppContainer } from 'react-hot-loader';

import Root from './components/Root';

const render = Component =>
	justRender(
		<AppContainer errorReporter={__DEV__ ? require('redbox-react').default : null}>
			<Component />
		</AppContainer>
	);

render(Root);

if (module.hot) {
	module.hot.accept(['./components/Root'], () => {
		const NextRoot = require('./components/Root').default;
		render(NextRoot);
	});
}
