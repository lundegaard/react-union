/* eslint-disable babel/new-cap,import/no-unresolved,import/extensions */
// ESLINT IS DISABLED BECAUSE DEPS ARE NOT RESOLVED IN UNION MONO REPO
import Loadable from 'react-loadable';

export default [
	{
		path: 'hero',
		component: Loadable({
			loader: () => import('union-widget-hero'),
			loading: () => null,
		}),
	},
	{
		path: 'content',
		component: Loadable({
			loader: () => import('union-widget-content'),
			loading: () => null,
		}),
	},
];
