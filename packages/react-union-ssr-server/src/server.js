const connect = require('connect');
const http = require('http');
const bodyParser = require('body-parser');
const R = require('ramda');

const { getPort, printUsage } = require('./utils/cli');
const makeRender = require('./render');
const makeRenderHandler = require('./routes/render');
const makeHealthHandler = require('./routes/health');

// TODO: maybe add some options as the second parameter
const startServer = applicationHandler => {
	const render = makeRender(applicationHandler);

	if (global.IS_DEV_SERVER) {
		return R.partial(makeRenderHandler, [render]);
	}

	const app = connect();
	app.use(bodyParser.text());
	app.use('/', makeRenderHandler(render, { clientStats: global.CLIENT_STATS }));
	app.use('/health', makeHealthHandler());

	const server = http.createServer(app);
	const port = getPort();
	server.listen(port);
	printUsage(port);

	return server;
};

module.exports = startServer;
