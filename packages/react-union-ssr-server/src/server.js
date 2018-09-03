const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');

const makeContentRenderer = require('./core');
const { getPortArgument } = require('./utils');

module.exports = applicationHandler => {
	const app = connect();
	const renderContent = makeContentRenderer(applicationHandler);

	app.use(bodyParser.text());

	const makeHandleRequest = options => async (req, res, next) => {
		try {
			const content = await renderContent(req.body, options, { req, res });

			// NOTE: res.forceEnd is defined iff we are running a dev server
			if (res.forceEnd) {
				res.forceEnd(content);
			} else {
				res.writeHead(200, { 'Content-Type': 'application/html' });
				res.end(content);
			}
		} catch (error) {
			next(error);
		}
	};

	// NOTE: this global is undefined iff we are running a dev server
	if (!global.CLIENT_STATS) {
		// NOTE: signature is the same as WebpackHotServerMiddleware's `createHandler` options property
		return makeHandleRequest;
	}

	app.use('/health', (req, res) => {
		res.writeHead(200);
		res.end('Running!');
	});

	app.use(makeHandleRequest({ clientStats: global.CLIENT_STATS, isPrebuilt: true }));

	const server = http.createServer(app);

	const port = getPortArgument() || process.env.SSR_PORT || 3303;
	server.listen(port);
	console.log(`🚀 React-union SSR server is listening on port ${port} 🚀`);
};
