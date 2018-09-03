const React = require('react');
const ReactDOMServer = require('react-dom/server');
const cheerio = require('cheerio');
const { RenderingContext, scan } = require('react-union');
const { flushChunkNames } = require('react-universal-component/server');
const { default: flushChunks } = require('webpack-flush-chunks');

const { hoistComponentStatics, addInitialPropsToConfigs } = require('./utils');

module.exports = applicationHandler => async (originalHtml, options, httpContext) => {
	const { clientStats, isPrebuilt } = options;
	const document_$ = cheerio.load(originalHtml);
	const head = document_$('head');
	const body = document_$('body');
	const context = { head, body, ...httpContext };

	// NOTE: we need to pass routes here because of getInitialProps
	const render = async (reactElement, routes) => {
		const scanResult = scan(routes, document_$);
		const { configs } = scanResult;

		// NOTE: https://github.com/faceyspacey/react-universal-component#static-hoisting
		hoistComponentStatics(configs);

		const newConfigs = await addInitialPropsToConfigs(configs, context);
		const newScanResult = { ...scanResult, configs: newConfigs };

		const renderingContextProps = {
			value: {
				isServer: true,
				scanResult: newScanResult,
			},
		};

		const wrappedElement = React.createElement(
			RenderingContext.Provider,
			renderingContextProps,
			reactElement
		);

		// NOTE: https://github.com/faceyspacey/react-universal-component/issues/74
		// we are doing this to make sure that the next `flushChunkNames()` call will only contain
		// the universal components from `renderToString`
		flushChunkNames();
		const rawHtml = ReactDOMServer.renderToString(wrappedElement);

		const raw_$ = cheerio.load(rawHtml);

		raw_$('[data-union-portal]').each((_, widget) => {
			const $widget = raw_$(widget);
			const id = $widget.data('union-portal');
			const selector = `#${id}`;
			const widgetHtml = $widget.html();

			document_$(selector).html(widgetHtml);
		});

		return {
			chunkNames: flushChunkNames(),
			scanResult: newScanResult,
		};
	};

	const { chunkNames, scanResult } = await applicationHandler({ render, ...context });

	const chunks = flushChunks(clientStats, {
		chunkNames,
		// NOTE: if the server is not prebuilt (we are running a dev server), the dev server
		// will output these chunks for us (and we don't want to insert them twice)
		before: isPrebuilt ? ['runtime', 'vendor'] : [],
		after: isPrebuilt ? ['main'] : [],
	});

	const { styles, cssHash, js } = chunks;

	head.append(styles.toString());
	body.append(cssHash.toString());
	body.append(js.toString());

	body.append(`<script>window.__SCAN_RESULT__=${JSON.stringify(scanResult)};</script>`);

	return document_$.html();
};
