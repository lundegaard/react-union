import universal from 'react-universal-component';

export default [
	{
		path: 'counter',
		component: universal(import('@union-liferay/widget-counter')),
	},
];
