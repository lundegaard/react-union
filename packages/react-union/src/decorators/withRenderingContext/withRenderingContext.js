import React from 'react';

import { RenderingContext } from '../../contexts';
import { getDisplayName, rejectNil } from '../../utils';

/**
 * HOC which spreads the surrounding RenderingContext's value to passed component.
 *
 * @param {React.Component} NextComponent component to bind the props to
 */
const withRenderingContext = NextComponent => {
	const WithRenderingContext = props => (
		<RenderingContext.Consumer>
			{value => <NextComponent {...props} {...rejectNil(value)} />}
		</RenderingContext.Consumer>
	);

	WithRenderingContext.displayName = `WithRenderingContext(${getDisplayName(NextComponent)})`;

	return WithRenderingContext;
};

export default withRenderingContext;
