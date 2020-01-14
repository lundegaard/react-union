import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import { WidgetConfigShape } from '../../shapes';
import { getDisplayName } from '../../utils';

const getWidgetName = path(['props', 'config', 'widget']);

const withErrorBoundary = NextComponent => {
	class WithErrorBoundary extends Component {
		static displayName = `WithErrorBoundary(${getDisplayName(NextComponent)})`;

		static propTypes = {
			config: PropTypes.shape(WidgetConfigShape).isRequired,
		};

		state = {
			hasError: false,
		};

		componentDidCatch() {
			this.setState({ hasError: true });
		}

		render() {
			const { hasError } = this.state;
			const widgetName = getWidgetName(this);

			if (hasError) {
				return (
					<div>
						{`An error has occurred in widget "${widgetName}". See the console for more details. To
						avoid seeing this message in production, wrap this widget in an error boundary.`}
					</div>
				);
			}

			return <NextComponent {...this.props} />;
		}
	}

	return WithErrorBoundary;
};

export default withErrorBoundary;
