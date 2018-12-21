const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');
const invariant = require('invariant');
const morgan = require('morgan');

const healthMiddleware = require('./middleware/healthMiddleware');
const renderingMiddleware = require('./middleware/renderingMiddleware');

const startServer = (handleRequest, options = global.ReactUnionSSRServerOptions) => {
	invariant(handleRequest, 'SSR request handler is undefined.');
	invariant(options, 'SSR server options are undefined.');

	if (options.isMiddleware) {
		// NOTE: This is the Webpack Hot Server Middleware integration.
		return ({ clientStats }) => {
			invariant(clientStats, 'Client stats are undefined.');

			return renderingMiddleware(handleRequest, { ...options, clientStats });
		};
	}

	const app = connect();

	app.use(morgan('combined'));
	app.use(bodyParser.text({ type: 'text/*', limit: '10mb' }));

	app.use('/health', healthMiddleware());
	app.use('/', renderingMiddleware(handleRequest, options));

	const server = http.createServer(app);

	const port = process.env.PORT || options.port;
	server.listen(port);
	console.log(`🚀 React Union SSR server is listening on port ${port}.`);

	return server;
};

module.exports = startServer;
