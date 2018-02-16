import React from 'react';
import { Union } from 'react-union';

import routes from './routes';
import './scss/front.scss';

const Root = () => <Union routes={routes} />;

export default Root;
