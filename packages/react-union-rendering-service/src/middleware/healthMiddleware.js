const healthMiddleware = () => (req, res) => {
	res.writeHead(200);
	res.end();
};

module.exports = healthMiddleware;
