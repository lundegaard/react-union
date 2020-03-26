import React from 'react';
import PropTypes from 'prop-types';

const Link = ({ href, to, ...rest }) => (
	<a href={to || href} {...(href ? { 'data-senna-off': 'true' } : {})} {...rest} />
);

Link.propTypes = {
	/** If set, the senna navigation is turned off. */
	href: PropTypes.string,
	/** If set, the senna navigation is used. */
	to: PropTypes.string,
};

export default Link;
