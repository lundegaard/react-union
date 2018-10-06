module.exports = () => (req, res) => {
	res.writeHead(200);
	// TODO: Perhaps provide more info, such as the uptime, last call, etc.
	res.end('Running!');
};
