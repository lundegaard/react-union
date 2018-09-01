const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');

const makeContentRenderer = require('./core');

module.exports = applicationHandler => {
	const app = connect();
	const renderContent = makeContentRenderer(applicationHandler);

	app.use(bodyParser.text());

	const makeHandleRequest = options => async (req, res, next) => {
		try {
			const content = await renderContent(req.body, options, { req, res });

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

	if (!global.SSR_CLIENT_STATS) {
		return makeHandleRequest;
	}

	app.use(makeHandleRequest({ clientStats: global.SSR_CLIENT_STATS, isPrebuilt: true }));

	// TODO: add health check endpoint ('/health')

	const server = http.createServer(app);

	// TODO: use process.env.SOMETHING or get the port from some reasonable source
	const port = 3303;
	server.listen(port);
	console.log(`🚀 React-union SSR server is listening on port ${port} 🚀`);
};
