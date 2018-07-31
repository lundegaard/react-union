const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const cheerio = require('cheerio');
const { ReportChunks } = require('react-universal-component');
const { default: flushChunks } = require('webpack-flush-chunks');

module.exports = (appConfig, appHandler, clientStats) => {
	const app = new Koa();

	app.use(bodyParser({ enableTypes: ['text'] }));

	app.use(async ctx => {
		const document_$ = cheerio.load(ctx.request.body);
		const head = document_$('head');
		const body = document_$('body');

		const chunkNames = [];

		const render = reactElement => {
			const clonedElement = React.cloneElement(reactElement, {
				isServer: true,
				parent: document_$,
			});

			const props = {
				report: chunkName => chunkNames.push(chunkName),
			};

			const rawHtml = ReactDOMServer.renderToString(
				React.createElement(ReportChunks, props, clonedElement)
			);

			const raw_$ = cheerio.load(rawHtml);

			raw_$('[data-union-portal]').each((_, widget) => {
				const $widget = raw_$(widget);
				const id = $widget.data('union-portal');
				const selector = `#${id}`;
				const widgetHtml = $widget.html();

				document_$(selector).html(widgetHtml);
			});
		};

		appHandler({ render, head, body, ctx });

		const chunks = flushChunks(clientStats, {
			chunkNames,
			before: ['runtime', 'vendor'],
			after: ['main'],
		});

		const { styles, cssHash, js } = chunks;

		head.append(styles.toString());
		body.append(cssHash.toString());
		body.append(js.toString());

		ctx.body = document_$.html();
	});

	return app;
};
