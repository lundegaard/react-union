const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');

const cli = require('../cli');
const makeRenderer = require('../rendering');
const middleware = require('../middleware');

const startServer = (applicationHandler, options) => {
	const renderer = makeRenderer(applicationHandler, options);

	if (global.DEV_MIDDLEWARE) {
		return middleware.rendering(renderer);
	}

	const app = connect();
	app.use(bodyParser.text());
	app.use('/', middleware.rendering(renderer, { clientStats: global.clientStats }));
	app.use('/health', middleware.health());

	const server = http.createServer(app);
	const port = cli.getPort();
	server.listen(port);
	cli.printUsage(port);

	return server;
};

module.exports = startServer;
