const { noop } = require('ramda-extension');
const { isRequestForHTML } = require('../utils');

/**
 * Because browserSync only uses Connect and not Express or any other framework,
 * we need to gather the response body ourselves. Because `res.end` is called under the hood
 * to send the response to the client, we intercept the call and use the original one
 * in the SSR server middleware instead.
 */
const responseCapturerMiddleware = () => (req, res, next) => {
	if (isRequestForHTML(req)) {
		res.body = null;
		res.originals = { ...res };

		res.end = data => {
			res.body = res.body || data;
			next();
		};

		res.setHeader = noop;
		res.write = noop;
		res.writeHead = noop;
	}

	next();
};

module.exports = responseCapturerMiddleware;
