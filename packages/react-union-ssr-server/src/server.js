const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');

const makeContentRenderer = require('./core');
const { getPortArgument } = require('./utils');

module.exports = applicationHandler => {
	const app = connect();
	const renderContent = makeContentRenderer(applicationHandler);

	app.use(bodyParser.text());

	// NOTE: `options` will be provided by WebpackHotServerMiddleware iff we are running a dev server
	// The signature matches the `createHandler` property
	const makeHandleRequest = options => async (req, res, next) => {
		try {
			const content = await renderContent(req.body, options, { req, res });

			// NOTE: `res.useForce` is true iff we are running a dev server
			if (res.useForce) {
				res.statusMessage = 'OK';
				res.forceWriteHead(200);
				res.forceEnd(content);
			} else {
				res.writeHead(200, { 'Content-Type': 'application/html' });
				res.end(content);
			}
		} catch (error) {
			next(error);
		}
	};

	// NOTE: this global is undefined iff we are running a dev server, otherwise, it is provided
	// in the `react-union-scripts` build script
	if (!global.CLIENT_STATS) {
		return makeHandleRequest;
	}

	app.use('/health', (req, res) => {
		res.writeHead(200);
		// TODO: Perhaps provide more info, such as the uptime, last call, etc.
		res.end('Running!');
	});

	app.use(makeHandleRequest({ clientStats: global.CLIENT_STATS, isPrebuilt: true }));

	const server = http.createServer(app);

	const port = getPortArgument() || process.env.SSR_PORT || 3303;
	server.listen(port);
	console.log(`🚀 React-union SSR server is listening on port ${port} 🚀`);
};
