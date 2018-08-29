/* eslint-disable no-console, global-require, import/no-dynamic-require */
const run = require('./scripts/run');

function runCommand(command) {
	return run(require(`./scripts/${command}`));
}

const command = process.argv[2];

// TODO: consistent naming (start-ssr-server is weird alongside startDevServer)
if (['start', 'build', 'test', 'start-ssr-server'].includes(command)) {
	runCommand(command).catch(err => {
		console.error(process.argv.includes('--verbose') ? err.stack : `ERROR: ${err.message}`);
		process.exit(1);
	});
} else {
	console.error('Unknown command.');
	process.exit(1);
}
