import React, { Component } from 'react';
import path from 'ramda/src/path';

import { ConfigShape } from '../../shapes';
import { getDisplayName } from '../../utils';

const getWidgetName = path(['props', 'descriptor', 'widget']);

const withErrorBoundary = NextComponent => {
	class WithErrorBoundary extends Component {
		static propTypes = ConfigShape;

		static displayName = `WithErrorBoundary(${getDisplayName(NextComponent)})`;

		state = {
			hasError: false,
		};

		componentDidCatch() {
			this.setState({ hasError: true });
		}

		render() {
			const widgetName = getWidgetName(this);
			const { hasError } = this.state;

			if (hasError) {
				// TODO: perhaps show some tips for common mistakes?
				return `An error has occurred in widget "${widgetName}". See the console output for more details.`;
			}

			return <NextComponent {...this.props} />;
		}
	}

	return WithErrorBoundary;
};

export default withErrorBoundary;
