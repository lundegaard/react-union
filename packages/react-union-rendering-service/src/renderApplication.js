const React = require('react');
const ReactDOMServer = require('react-dom/server');
const cheerio = require('cheerio');
const { PrescanContext, scan, route } = require('react-union');
const { flushChunkNames } = require('react-universal-component/server');
const { default: flushChunks } = require('webpack-flush-chunks');
const invariant = require('invariant');
const { forEach, call, __, compose, map, path, isEmpty } = require('ramda');
const { rejectNil } = require('ramda-extension');

const resolveInitialProps = require('./resolveInitialProps');

const hoistComponentStatics = compose(
	forEach(call(__)),
	rejectNil,
	map(path(['component', 'preloadWeak']))
);

const renderApplication = async ({ handleRequest, options, originalHTML, req, res }) => {
	const {
		isMiddleware = false,
		clientStats = null,
		waveReduction = true,
		skipEmptyScans = false,
		beforeChunks = [],
		afterChunks = [],
	} = options;

	const original_$ = cheerio.load(originalHTML);
	const head = original_$('head');
	const body = original_$('body');
	const context = { head, body, req, res };

	// NOTE: We need to pass routes here because of getInitialProps.
	// In order to get the initial props, we need to get the list of all rendered components.
	// To do that, we need to call `scan` ourselves here.
	const render = async (reactElement, routes, applicationContext) => {
		const scanResult = scan(original_$);

		if (skipEmptyScans && isEmpty(scanResult.widgetDescriptors)) {
			return { widgetConfigs: [], chunkNames: [], initialProps: {} };
		}

		const { widgetConfigs } = route(routes, scanResult);

		// NOTE: https://github.com/faceyspacey/react-universal-component#static-hoisting
		// Without calling this function, `getInitialProps` statics will not be defined.
		hoistComponentStatics(widgetConfigs);

		const initialProps = await resolveInitialProps(
			{ ...context, ...applicationContext },
			widgetConfigs
		);

		const wrappedElement = React.createElement(
			PrescanContext.Provider,
			{ value: { initialProps, widgetConfigs } },
			reactElement
		);

		// NOTE: https://github.com/faceyspacey/react-universal-component/issues/74
		// We are doing this to make sure that the next `flushChunkNames()` call will only contain
		// the universal components from `renderToString`, not from other asynchronous requests.
		flushChunkNames();
		const reactHTML = ReactDOMServer.renderToString(wrappedElement);
		const chunkNames = flushChunkNames();

		const react_$ = cheerio.load(reactHTML);

		react_$('[data-union-portal]').each((_, widget) => {
			const $widget = react_$(widget);
			const id = $widget.data('union-portal');
			const selector = `#${id}`;
			const $container = original_$(selector);

			invariant($container, `HTML element with ID "${id}" could not be found.`);

			const widgetHTML = $widget.html();
			$container.html(widgetHTML);
		});

		return { widgetConfigs, chunkNames, initialProps };
	};

	const renderResult = await handleRequest({ render, ...context });
	invariant(renderResult, 'You did not call `render(<Root />)` in your SSR request handler.');
	const { widgetConfigs, chunkNames, initialProps } = renderResult;

	if (skipEmptyScans && isEmpty(widgetConfigs)) {
		return originalHTML;
	}

	if (clientStats && waveReduction) {
		const chunks = flushChunks(clientStats, {
			chunkNames,
			before: isMiddleware ? [] : beforeChunks,
			after: isMiddleware ? [] : afterChunks,
		});

		const { styles, js } = chunks;

		head.append(styles.toString());
		body.append(js.toString());
	}

	body.prepend(`<script>window.__INITIAL_PROPS__=${JSON.stringify(initialProps)}</script>`);
	body.prepend('<script>window.__HYDRATE__=true</script>');
	return original_$.html();
};

module.exports = renderApplication;
