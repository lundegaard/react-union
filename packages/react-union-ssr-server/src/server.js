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
	// NOTE: this global is undefined iff we are running a dev server, otherwise, it is provided
	// in the `react-union-scripts` build script
	if (!global.CLIENT_STATS) {
		return R.partial(makeRenderHandler, [render]);
	}

	const options = {
		clientStats: global.CLIENT_STATS,
		isPrebuilt: true,
	};

	const app = connect();
	app.use(bodyParser.text());
	app.use('/', makeRenderHandler(render, options));
	app.use('/health', makeHealthHandler());

	const server = http.createServer(app);
	const port = getPort();
	server.listen(port);
	printUsage(port);

	return server;
};

module.exports = startServer;
