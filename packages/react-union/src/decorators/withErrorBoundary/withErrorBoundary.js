import React, { Component } from 'react';
import PropTypes from 'prop-types';
import path from 'ramda/src/path';

import { ConfigShape } from '../../shapes';
import { getDisplayName } from '../../utils';

const getWidgetName = path(['props', 'config', 'descriptor', 'widget']);

const withErrorBoundary = NextComponent => {
	class WithErrorBoundary extends Component {
		static propTypes = {
			config: PropTypes.shape(ConfigShape).isRequired,
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
				// TODO: perhaps show some tips for common mistakes?
				return `An error has occurred in widget "${widgetName}". See the console output for more details.`;
			}

			return <NextComponent {...this.props} />;
		}
	}

	return WithErrorBoundary;
};

export default withErrorBoundary;
