import universal from 'react-universal-component';

export default [
	{
		path: 'hero',
		component: universal(import('@union-app/widget-hero')),
	},
	{
		path: 'content',
		component: universal(import('@union-app/widget-content')),
	},
];
