const path = require('path');

module.exports = {
	snapshotSerializers: ['enzyme-to-json/serializer'],
	setupTestFrameworkScriptFile: path.join(process.cwd(), 'tests', 'enzymeSetup.js'),
};
