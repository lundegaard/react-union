import React, { Component } from 'react';
import PropTypes from 'prop-types';
import path from 'ramda/src/path';

import { WidgetConfigShape } from '../../shapes';
import { getDisplayName } from '../../utils';

const getWidgetName = path(['props', 'config', 'widget']);

const withErrorBoundary = NextComponent => {
	class WithErrorBoundary extends Component {
		static propTypes = {
			config: PropTypes.shape(WidgetConfigShape).isRequired,
		};

		static displayName = `WithErrorBoundary(${getDisplayName(NextComponent)})`;

		state = {
			hasError: false,
		};

		componentDidCatch() {
			this.setState({ hasError: true });
		}

		render() {
			const widgetName = getWidgetName(this);

			if (this.state.hasError) {
				return (
					<div>
						An error has occurred in widget "{widgetName}". See the console for more details. To
						avoid seeing this message in production, wrap this widget in an error boundary.
					</div>
				);
			}

			return <NextComponent {...this.props} />;
		}
	}

	return WithErrorBoundary;
};

export default withErrorBoundary;
