const run = require('./run');

function start() {
	return run(require('./startDevServer'));
}

module.exports = start;
