import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { getDisplayName } from '../utils';
import { WidgetContext } from '../contexts';

export const makeContextDecorator = (Context, displayName) => NextComponent => {
	const Decorator = props => (
		<Context.Consumer>{value => <NextComponent {...value} {...props} />}</Context.Consumer>
	);

	hoistNonReactStatics(Decorator, NextComponent);
	Decorator.displayName = `With${displayName}(${getDisplayName(NextComponent)})`;

	return Decorator;
};

export const withWidgetContext = makeContextDecorator(WidgetContext, 'WidgetContext');
export { default as withErrorBoundary } from './withErrorBoundary';
