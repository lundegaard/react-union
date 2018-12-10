// TODO: Provide more info, such as the uptime, last call, etc.
const healthMiddleware = () => (req, res) => {
	res.writeHead(200);
	res.end();
};

module.exports = healthMiddleware;
