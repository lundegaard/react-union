import universal from 'react-universal-component';

export default [
	{
		path: 'hero',
		component: universal(import('@union-liferay/widget-hero')),
	},
	{
		path: 'content',
		component: universal(import('@union-liferay/widget-content')),
	},
];
