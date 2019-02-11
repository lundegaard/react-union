import universal from 'react-universal-component';

export default [
	{
		path: 'hero',
		component: universal(import('@union-monorepo/widget-hero')),
	},
	{
		path: 'content',
		component: universal(import('@union-monorepo/widget-content')),
	},
];
