import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { WidgetContext } from '../../contexts';
import { getDisplayName } from '../../utils';

/**
 * HOC which spreads the surrounding WidgetContext's value to passed component.
 *
 * @param {React.Component} NextComponent component to bind the props to
 */
const withWidgetContext = NextComponent => {
	const WithWidgetContext = props => (
		<WidgetContext.Consumer>
			{value => <NextComponent {...props} {...value} />}
		</WidgetContext.Consumer>
	);

	hoistNonReactStatics(WithWidgetContext, NextComponent);
	WithWidgetContext.displayName = `WithWidgetContext(${getDisplayName(NextComponent)})`;

	return WithWidgetContext;
};

export default withWidgetContext;
