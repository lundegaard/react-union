import React from 'react';

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

	WithWidgetContext.displayName = `WithWidgetContext(${getDisplayName(NextComponent)})`;

	return WithWidgetContext;
};

export default withWidgetContext;
