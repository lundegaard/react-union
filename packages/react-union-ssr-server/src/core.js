const React = require('react');
const ReactDOMServer = require('react-dom/server');
const cheerio = require('cheerio');
const { ServerContext, scan, createWidgetConfigs } = require('react-union');
const { flushChunkNames } = require('react-universal-component/server');
const { default: flushChunks } = require('webpack-flush-chunks');

const { hoistComponentStatics, getAllInitialProps } = require('./utils');

const makeContentRenderer = applicationHandler => async (originalHTML, options, httpContext) => {
	const { clientStats, isPrebuilt } = options;
	const document_$ = cheerio.load(originalHTML);
	const head = document_$('head');
	const body = document_$('body');

	// NOTE: We need to pass routes here because of getInitialProps.
	// In order to get the initial props, we need to get the list of all rendered components.
	// To do that, we need to call `scan` ourselves here.
	const render = async (reactElement, routes, applicationContext) => {
		const scanResult = scan(document_$);
		const widgetConfigs = createWidgetConfigs(routes, scanResult);
		const context = { head, body, ...httpContext, ...applicationContext };

		// NOTE: https://github.com/faceyspacey/react-universal-component#static-hoisting
		// Without calling this function, `getInitialProps` statics will not be defined.
		hoistComponentStatics(widgetConfigs);

		const initialProps = await getAllInitialProps(widgetConfigs, context);

		const serverContextProps = {
			value: {
				initialProps,
				isServer: true,
				widgetConfigs,
			},
		};

		const wrappedElement = React.createElement(
			ServerContext.Provider,
			serverContextProps,
			reactElement
		);

		// NOTE: https://github.com/faceyspacey/react-universal-component/issues/74
		// We are doing this to make sure that the next `flushChunkNames()` call will only contain
		// the universal components from `renderToString`, not from other asynchronous requests.
		flushChunkNames();
		const rawHTML = ReactDOMServer.renderToString(wrappedElement);
		const chunkNames = flushChunkNames();

		const raw_$ = cheerio.load(rawHTML);

		raw_$('[data-union-portal]').each((_, widget) => {
			const $widget = raw_$(widget);
			const id = $widget.data('union-portal');
			const selector = `#${id}`;
			const $element = document_$(selector);

			if (!$element) {
				return console.error(`HTML element with ID "${id}" could not be found.`);
			}

			const widgetHTML = $widget.html();
			$element.html(widgetHTML);
		});

		return {
			chunkNames,
			scanResult,
			initialProps,
		};
	};

	const context = { render, head, body, ...httpContext };
	// NOTE: application handler must return the return value of calling the `render` function
	const { chunkNames, scanResult, initialProps } = await applicationHandler(context);

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

	body.prepend(
		`<script>
			window.__HYDRATE__=true;
			window.__SCAN_RESULT__=${JSON.stringify(scanResult)};
			window.__INITIAL_PROPS__=${JSON.stringify(initialProps)};
		</script>`
	);

	return document_$.html();
};

module.exports = makeContentRenderer;
