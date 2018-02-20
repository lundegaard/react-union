import React, { Component } from 'react';
import path from 'ramda/src/path';

import { ConfigShape } from '../../shapes';

const getName = path(['props', 'descriptor', 'name']);

const withErrorBoundary = WrappedComponent => {
	class UnionWidgetErrorBoundary extends Component {
		static propTypes = ConfigShape;

		state = {
			hasError: false,
		};

		componentDidCatch() {
			this.setState({ hasError: true });
		}

		render() {
			const name = getName(this);

			if (this.state.hasError) {
				// TODO: perhaps show some tips for common mistakes?
				return `An error has occured in widget "${name}". See the console output for more details.`;
			}

			return <WrappedComponent {...this.props} />;
		}
	}

	return UnionWidgetErrorBoundary;
};

export default withErrorBoundary;
