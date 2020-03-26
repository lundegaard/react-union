#!/usr/bin/env node
const fs = require('fs');

if (process.argv[2] === '-v' || process.argv[2] === '--version') {
	const pkg = JSON.parse(fs.readFileSync(require.resolve('../package.json'), 'utf8'));
	console.log(`v${pkg.version}`);
	process.exit(0);
}

if (process.versions.node.split('.')[0] < 10) {
	console.error('ERROR: This tool requires Node.js v10 or higher.');
	process.exit(1);
} else {
	require('../cli');
}
