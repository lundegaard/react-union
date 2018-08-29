import React from 'react';
import startServer from 'react-union-ssr-server';

import Root from './components/Root';

const handleRequest = ({ render }) => {
	render(<Root />);
};

startServer(handleRequest);
