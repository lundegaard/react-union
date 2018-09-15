const { o, replace, mapObjIndexed, values, map, pipe } = require('ramda');
const { isArray, isString, isFunction } = require('ramda-extension');
const httpProxyMiddleware = require('http-proxy-middleware');

// webpack 4.0 compatible. based on impl from webpack dev-server
const proxyMiddleware = ({ proxy } = {}) => {
	if (!proxy) {
		return [];
	}
	let normalizedConfig = proxy;
	if (!isArray(proxy)) {
		normalizedConfig = pipe(
			mapObjIndexed((target, context) => {
				// for more info see https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L193
				const correctedContext = o(replace(/\/\*$/, ''), replace(/^\*$/, '**'))(context);
				if (isString(target)) {
					return {
						context: correctedContext,
						target,
					};
				} else {
					return {
						...target,
						context: correctedContext,
					};
				}
			}),
			values
		)(proxy);
	}
	return map(config => {
		const proxyConfig = isFunction(config) ? config() : config;
		return httpProxyMiddleware(proxyConfig.context, proxyConfig);
	}, normalizedConfig);
};

module.exports = {
	proxyMiddleware,
};
