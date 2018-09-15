import React from 'react';
import startServer from 'react-union-ssr-server';

import Root from './components/Root';
import routes from './routes';

const handleRequest = ({ render }) => render(<Root isServer />, routes);

export default startServer(handleRequest);
