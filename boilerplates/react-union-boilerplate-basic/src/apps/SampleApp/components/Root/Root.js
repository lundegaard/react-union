import React from 'react';
import PropTypes from 'prop-types';
import { Union } from 'react-union';
import { hot } from 'react-hot-loader';

import routes from '../../routes';

import './Root.css';

// NOTE: If you don't need SSR, remove the propTypes and replace the following line with:
// const Root = () => <Union routes={routes} />;
const Root = ({ isServer }) => <Union routes={isServer ? null : routes} />;

Root.propTypes = {
	isServer: PropTypes.bool,
};

export default hot(module)(Root);
