import React from 'react';

import { RenderingContext } from '../../contexts';
import { getDisplayName } from '../../utils';

/**
 * HOC which spreads the surrounding RenderingContext's value to passed component.
 *
 * @param {React.Component} NextComponent component to bind the props to
 */
const withRenderingContext = NextComponent => {
	const WithRenderingContext = props => (
		<RenderingContext.Consumer>
			{value => <NextComponent {...props} {...value} />}
		</RenderingContext.Consumer>
	);

	WithRenderingContext.displayName = `WithRenderingContext(${getDisplayName(NextComponent)})`;

	return WithRenderingContext;
};

export default withRenderingContext;
