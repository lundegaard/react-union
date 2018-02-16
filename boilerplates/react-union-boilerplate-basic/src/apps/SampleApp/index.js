import React from 'react';
import { justRender } from 'react-union';
import { AppContainer } from 'react-hot-loader';

import './scss/front.scss';
import Root from './Root';

const render = Component =>
	justRender(
		<AppContainer errorReporter={__DEV__ ? require('redbox-react').default : null}>
			<Component />
		</AppContainer>
	);

render(Root);

if (module.hot) {
	module.hot.accept(['./Root'], () => {
		const NextRoot = require('./Root').default;
		render(NextRoot);
	});
}
