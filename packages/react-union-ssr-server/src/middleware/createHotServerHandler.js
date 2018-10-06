/**
 * `createHandler` property for WebpackHotServerMiddleware
 */
const createHotServerHandler = (error, handleRequest) => (req, res, next) => {
	if (error) {
		return next(error);
	}

	if (req.url !== '/index.html' && req.url !== '/') {
		return next();
	}

	try {
		next();
		// NOTE: We are essentially emulating the `bodyParser.text()` middleware here.
		// `res.body` is populated using the `responseCaptureMiddleware` in the dev server.
		req.body = res.body;
		handleRequest(req, res, next);
	} catch (error) {
		next(error);
	}
};

module.exports = createHotServerHandler;
