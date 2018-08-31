const React = require('react');
const ReactDOMServer = require('react-dom/server');
const cheerio = require('cheerio');
const { RenderingContext, scan } = require('react-union');
const { flushChunkNames } = require('react-universal-component/server');
const { default: flushChunks } = require('webpack-flush-chunks');

const { hoistComponentStatics, addInitialPropsToConfigs } = require('./utils');

module.exports = (applicationHandler, shouldFlushChunks) => async (originalHtml, httpContext) => {
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
		// TODO: check if this actually works for multiple parallel requests
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
	};

	await applicationHandler({ render, ...context });

	const chunkNames = flushChunkNames();

	if (!shouldFlushChunks) {
		return document_$.html();
	}

	// NOTE: this variable is defined in react-union-scripts' build.js (prepended to the bundle)
	// eslint-disable-next-line no-undef
	const chunks = flushChunks(SSR_CLIENT_STATS, {
		chunkNames,
		before: ['runtime', 'vendor'],
		after: ['main'],
	});

	const { styles, cssHash, js } = chunks;

	head.append(styles.toString());
	body.append(cssHash.toString());
	body.append(js.toString());

	return document_$.html();
};
