/**
 * `createHandler` property for WebpackHotServerMiddleware
 */
module.exports = (error, handleRequest) => async (req, res, next) => {
	if (error) {
		next(error);
	}

	if (req.url !== '/index.html' && req.url !== '/') {
		return next();
	}

	try {
		next();
		req.body = res.body;
		await handleRequest(req, res, next);
	} catch (error) {
		next(error);
	}
};
