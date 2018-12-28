import React from 'react';
import run from 'react-union-rendering-service';

import Root from './components/Root';
import routes from './routes';

const handleRequest = ({ render }) => render(<Root />, routes);

export default run(handleRequest);
