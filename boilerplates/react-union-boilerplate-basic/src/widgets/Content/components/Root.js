import React from 'react';
import PropTypes from 'prop-types';
import NestedComponent from './NestedComponent';

const Root = ({ namespace, data }) => (
	<div>
		I am the Content widget. My namespace is <b>{namespace}</b> and my initial data is
		<b> {JSON.stringify(data)}</b>.<NestedComponent />
	</div>
);

Root.propTypes = {
	data: PropTypes.shape({
		foo: PropTypes.string,
	}),
	namespace: PropTypes.string,
};

export default Root;
