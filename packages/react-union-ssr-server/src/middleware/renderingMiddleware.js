const { curry } = require('ramda');
const { isRequestForHTML } = require('../utils');

// NOTE: `options` will be provided by WebpackHotServerMiddleware iff we are running a dev server
// The signature matches the `createHandler` property
// TODO: Modify HTTP response based on types of errors (bad portal data, React error, etc.)
const renderingMiddleware = curry((renderer, options) => async (req, res, next) => {
	try {
		if (global.DEV_MIDDLEWARE) {
			if (!isRequestForHTML(req)) {
				return next();
			}

			const content = await renderer(res.body, options.clientStats, { req, res });
			res.statusMessage = 'OK';
			res.originals.writeHead(200);
			res.originals.end(content);
		} else {
			const content = await renderer(req.body, options.clientStats, { req, res });
			res.writeHead(200, { 'Content-Type': 'application/html' });
			res.end(content);
		}
	} catch (error) {
		next(error);
	}
});

module.exports = renderingMiddleware;
