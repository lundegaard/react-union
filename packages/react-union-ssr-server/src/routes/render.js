// NOTE: `options` will be provided by WebpackHotServerMiddleware iff we are running a dev server
// The signature matches the `createHandler` property
module.exports = (render, options) => async (req, res, next) => {
	try {
		const content = await render(req.body, options.clientStats, { req, res });

		// NOTE: `res.useForce` is true iff we are running a dev server
		// TODO: more HTTP headers
		if (res.useForce) {
			res.statusMessage = 'OK';
			res.forceWriteHead(200);
			res.forceEnd(content);
		} else {
			res.writeHead(200, { 'Content-Type': 'application/html' });
			res.end(content);
		}
	} catch (error) {
		// TODO: Modify HTTP response based on types of errors (bad portal data, React error, etc.)
		next(error);
	}
};
