const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');

const makeContentRenderer = require('./core');

const IS_DEV_SERVER = typeof SSR_CLIENT_STATS === 'undefined';

module.exports = applicationHandler => {
	const app = connect();
	const renderContent = makeContentRenderer(applicationHandler, !IS_DEV_SERVER);

	app.use(bodyParser.text());

	const handleRequest = async (req, res, next) => {
		try {
			const content = await renderContent(req.body, { req, res });

			// TODO: add some useful headers
			// res.setHeader('Content-Type', 'application/html');

			if (res.__end) {
				res.__end(content);
			} else {
				res.end(content);
			}

			next();
		} catch (error) {
			next(error);
		}
	};

	app.use(handleRequest);

	// TODO: add health check endpoint ('/health')

	const server = http.createServer(app);

	if (!IS_DEV_SERVER) {
		// TODO: use process.env.SOMETHING or get the port from some reasonable source
		const port = 3303;
		server.listen(port);
		console.log(`🚀 React-union SSR server is listening on port ${port} 🚀`);
	}

	// NOTE: this structure is required for WebpackHotServerMiddleware to work
	// The middleware expects a `createHandler` function with the following signature
	// options => (req, res, next) => any
	return () => handleRequest;
};
