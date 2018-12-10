module.exports = {
	health: require('./healthMiddleware'),
	rendering: require('./renderingMiddleware'),
	responseCapturer: require('./responseCapturerMiddleware'),
};
