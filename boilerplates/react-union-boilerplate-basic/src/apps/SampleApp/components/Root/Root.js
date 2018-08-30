import React from 'react';
import PropTypes from 'prop-types';
import { Union } from 'react-union';
import { hot } from 'react-hot-loader';

import routes from '../../routes';

import './Root.scss';

const Root = ({ isServer }) => <Union routes={!isServer && routes} />;

Root.propTypes = {
	isServer: PropTypes.bool,
};

export default hot(module)(Root);
