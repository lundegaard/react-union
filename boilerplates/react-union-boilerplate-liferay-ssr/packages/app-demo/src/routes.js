import universal from 'react-universal-component';

export default [
	{
		path: 'hero',
		component: universal(import('@union-liferay-ssr/widget-hero'), { ignoreBabelRename: true }),
	},
	{
		path: 'content',
		component: universal(import('@union-liferay-ssr/widget-content'), { ignoreBabelRename: true }),
	},
];
