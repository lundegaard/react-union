// TODO: add chalk
const printUsage = port => {
	const log = console.log.bind(console);

	log(`🚀 React-union SSR server is listening on port ${port}.`);
	log();
	log('🔧 Basic usage:');
	log();
	log('    Instead of sending any HTML directly to the client, pipe it using "POST /" requests');
	log('    through this Node.js server. The raw HTML should be the body of the request.');
	log('    The response body will contain the new HTML to send to the client.');
	log();
	log('📄 HTTP status reference:');
	log();
	log('    200    Business as usual. Everything is set-up properly and you can enjoy your');
	log('           blazing fast page loads and improved SEO.');
	log();
	log('    500    Something went wrong. This might be due to wrong configuration,');
	log('           invalid CMS data or an unhandled application exception. Either way,');
	log('           you should send the original HTML to the client instead of an error.');
	log('           The console will contain more info about the exception.');
	log();
	log();
	log('See https://react-union.org/ for documentation and API reference.');
	log();
};

module.exports = printUsage;
