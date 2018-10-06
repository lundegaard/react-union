const React = require('react');
const ReactDOMServer = require('react-dom/server');
const cheerio = require('cheerio');
const { PrescanContext, scan, route } = require('react-union');
const { flushChunkNames } = require('react-universal-component/server');
const { default: flushChunks } = require('webpack-flush-chunks');
const invariant = require('invariant');

const { hoistComponentStatics, resolveInitialProps } = require('./utils/initialProps');

const makeRender = applicationHandler => async (originalHTML, options, httpContext) => {
	const { clientStats, isPrebuilt } = options;
	const original_$ = cheerio.load(originalHTML);
	const head = original_$('head');
	const body = original_$('body');

	// NOTE: we want the user to call `render()` as a side-effect!
	let chunkNames;
	let initialProps;

	// NOTE: We need to pass routes here because of getInitialProps.
	// In order to get the initial props, we need to get the list of all rendered components.
	// To do that, we need to call `scan` ourselves here.
	const render = async (reactElement, routes, applicationContext) => {
		const scanResult = scan(original_$);
		const { widgetConfigs } = route(routes, scanResult);
		const context = { head, body, ...httpContext, ...applicationContext };

		// NOTE: https://github.com/faceyspacey/react-universal-component#static-hoisting
		// Without calling this function, `getInitialProps` statics will not be defined.
		hoistComponentStatics(widgetConfigs);

		initialProps = await resolveInitialProps(context, widgetConfigs);

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
		chunkNames = flushChunkNames();

		const react_$ = cheerio.load(reactHTML);

		// NOTE: Here we are populating the original HTML with the widget content.
		react_$('[data-union-portal]').each((_, widget) => {
			const $widget = react_$(widget);
			const id = $widget.data('union-portal');
			const selector = `#${id}`;
			const $container = original_$(selector);

			invariant($container, `HTML element with ID "${id}" could not be found.`);

			const widgetHTML = $widget.html();
			$container.html(widgetHTML);
		});
	};

	const context = { render, head, body, ...httpContext };

	// NOTE: Here is where all the application-specific magic happens. SIDE EFFECTS!
	await applicationHandler(context);

	invariant(chunkNames, 'You did not call `render` in your SSR application handler.');

	const chunks = flushChunks(clientStats, {
		chunkNames,
		// NOTE: If the server is not prebuilt (we are running a dev server), the dev server
		// will output these chunks for us (and we don't want to insert them twice).
		// TODO: This definitely won't be this easy, we need some additional checks to see
		// if we should actually insert the scripts into the application.
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
			window.__INITIAL_PROPS__=${JSON.stringify(initialProps)};
		</script>`
	);

	return original_$.html();
};

module.exports = makeRender;
