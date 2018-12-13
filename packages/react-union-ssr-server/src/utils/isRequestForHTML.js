const isRequestForHTML = req => req.headers.accept && req.headers.accept.includes('text/html');

module.exports = isRequestForHTML;
