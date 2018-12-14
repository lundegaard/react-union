const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');

const { getArgValue } = require('../utils');
const makeRenderer = require('../rendering');
const middleware = require('../middleware');

const startServer = (applicationHandler, options) => {
	const renderer = makeRenderer(applicationHandler, options);

	if (global.ssr_isMiddleware) {
		return middleware.rendering(renderer);
	}

	const app = connect();
	app.use(bodyParser.text());
	app.use('/', middleware.rendering(renderer, { clientStats: global.ssr_clientStats }));
	app.use('/health', middleware.health());

	const server = http.createServer(app);
	const port = getArgValue('--port', process.argv) || process.env.SSR_PORT || 3303;
	server.listen(port);
	console.log(`🚀 React Union SSR server is listening on port ${port}.`);

	return server;
};

module.exports = startServer;
