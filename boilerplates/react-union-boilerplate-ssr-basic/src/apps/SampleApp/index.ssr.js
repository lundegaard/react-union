import React from 'react';
import { startRenderingService } from 'react-union-rendering-service';

import Root from './components/Root';
import routes from './routes';

const handleRequest = ({ render }) => render(<Root />, routes);

export default startRenderingService(handleRequest);
