const renderApplication = require('../core/renderApplication');
const isRequestForHTML = require('../core/isRequestForHTML');

const renderingMiddleware = (handleRequest, options) => async (req, res, next) => {
	const context = { handleRequest, options, req, res };

	try {
		if (options.isMiddleware) {
			if (!isRequestForHTML(req)) {
				return next();
			}

			const content = await renderApplication({ ...context, originalHTML: res.body });
			res.statusMessage = 'OK';
			res.originals.writeHead(200);
			res.originals.end(content);
		} else {
			const content = await renderApplication({ ...context, originalHTML: req.body });
			res.writeHead(200, { 'Content-Type': 'application/html' });
			res.end(content);
		}
	} catch (error) {
		next(error);
	}
};

module.exports = renderingMiddleware;
