import React from 'react';
import PropTypes from 'prop-types';

const Root = ({ data: { textation } }) => (
	<section>
		<h1>{textation.heading}</h1>
		<p>{textation.content}</p>
	</section>
);

Root.propTypes = {
	data: PropTypes.shape({
		textation: PropTypes.shape({
			heading: PropTypes.node,
			content: PropTypes.node,
		}),
	}),
};

export default Root;
