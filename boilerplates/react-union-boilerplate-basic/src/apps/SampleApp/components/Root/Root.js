import React from 'react';
import { Union } from 'react-union';

import routes from '../../routes';

import './Root.scss';

const Root = props => <Union routes={routes} {...props} />;

export default Root;
