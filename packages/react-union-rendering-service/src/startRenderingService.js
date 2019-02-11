const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');
const invariant = require('invariant');
const morgan = require('morgan');
const { mergeLeft } = require('ramda');

const healthMiddleware = require('./healthMiddleware');
const renderingMiddleware = require('./renderingMiddleware');

const startRenderingService = (handleRequest, options = {}) => {
	const resolvedOptions = mergeLeft(options, global.ReactUnionRenderingServiceOptions);

	invariant(handleRequest, 'SSR handler is undefined.');
	invariant(resolvedOptions, 'SSR options are undefined.');

	if (resolvedOptions.isMiddleware) {
		// NOTE: This is the Webpack Hot Server Middleware integration.
		return ({ clientStats }) => {
			invariant(clientStats, 'Client stats are undefined.');

			return renderingMiddleware(handleRequest, { ...resolvedOptions, clientStats });
		};
	}

	const app = connect();

	app.use(morgan('combined'));
	app.use(bodyParser.text({ type: 'text/*', limit: '10mb' }));

	app.use('/health', healthMiddleware());
	app.use('/', renderingMiddleware(handleRequest, resolvedOptions));

	const server = http.createServer(app);

	const port = process.env.PORT || resolvedOptions.port;
	server.listen(port);
	console.log(`🚀 React Union Rendering Service is listening on port ${port}.`);

	return server;
};

module.exports = startRenderingService;
