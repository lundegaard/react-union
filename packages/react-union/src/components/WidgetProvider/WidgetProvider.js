import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { WidgetContext } from '../../contexts';

/**
 * Adds the supplied widget data and namespace to the React context.
 */

const WidgetProvider = ({ namespace, data, children }) => (
	<WidgetContext.Provider
		value={{
			namespace,
			data,
		}}
	>
		{Children.only(children)}
	</WidgetContext.Provider>
);

WidgetProvider.propTypes = {
	/**
	 * Renders children
	 */
	children: PropTypes.node.isRequired,
	/**
	 * Data passed in the widget descriptor
	 */
	data: PropTypes.object,
	/**
	 * Unique string for the instance of `children`
	 */
	namespace: PropTypes.string.isRequired,
};

export default WidgetProvider;
