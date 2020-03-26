import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@union-liferay/ui-components';

const Root = ({ data: { messages } }) => (
	<section>
		<h1>{messages.heading}</h1>
		<p>{messages.content}</p>
		<p>
			<Link to="/">Back</Link>
		</p>
	</section>
);

Root.propTypes = {
	data: PropTypes.shape({
		messages: PropTypes.shape({
			heading: PropTypes.node,
			content: PropTypes.node,
		}),
	}),
};

export default Root;
