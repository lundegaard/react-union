/* eslint-disable import/no-unresolved,import/extensions */
// ESLINT IS DISABLED BECAUSE DEPS ARE NOT RESOLVED IN UNION MONO REPO
import universal from 'react-universal-component';

export default [
	{
		path: 'hero',
		component: universal(() => import('union-widget-hero')),
	},
	{
		path: 'content',
		component: universal(() => import('union-widget-content')),
	},
];
