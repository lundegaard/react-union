import React from 'react';
import PropTypes from 'prop-types';
import NestedComponent from './NestedComponent';

const Root = ({ namespace, data }) => (
	<div>
		I am widget Content with namespace <b>{namespace}</b> and initial data
		<b> {JSON.stringify(data)}</b>
		<NestedComponent />
	</div>
);

Root.propTypes = {
	data: PropTypes.shape({
		foo: PropTypes.string,
	}),
	namespace: PropTypes.string,
};

export default Root;
