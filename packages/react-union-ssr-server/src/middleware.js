/**
 * `createHandler` property for WebpackHotServerMiddleware
 */
module.exports = (error, handleRequest) => (req, res, next) => {
	if (error) {
		return next(error);
	}

	if (req.url !== '/index.html' && req.url !== '/') {
		return next();
	}

	try {
		next();
		req.body = res.body;
		handleRequest(req, res, next);
	} catch (error) {
		next(error);
	}
};
