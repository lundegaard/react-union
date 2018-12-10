const { noop } = require('ramda-extension');

/**
 * Because browserSync only uses Connect and not Express or any other framework,
 * we need to gather the response body ourselves. Because `res.end` is called under the hood
 * to send the response to the client, we intercept the call and use the original one
 * in the SSR server middleware instead.
 */
const responseCapturerMiddleware = () => {
	global.DEV_MIDDLEWARE = true;

	return (req, res, next) => {
		// TODO: Handle other URLs as well, but don't handle any assets.
		if (req.url === '/') {
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
};

module.exports = responseCapturerMiddleware;
