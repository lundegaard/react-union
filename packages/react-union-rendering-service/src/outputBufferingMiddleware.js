const { noop } = require('ramda-extension');

const isRequestForHTML = require('./isRequestForHTML');

/**
 * Because BrowserSync only uses Connect and not Express or any other framework,
 * we need to gather the response body ourselves. Because `res.end` is called under the hood
 * to send the response to the client, we defer the call to ensure the application is rendered.
 */
const outputBufferingMiddleware = () => (req, res, next) => {
	if (isRequestForHTML(req)) {
		res.body = null;
		// TODO: This can probably be improved.
		res.originals = { ...res };

		res.end = body => {
			res.body = res.body || body;
			next();
		};

		res.setHeader = noop;
		res.write = noop;
		res.writeHead = noop;
	}

	next();
};

module.exports = outputBufferingMiddleware;
