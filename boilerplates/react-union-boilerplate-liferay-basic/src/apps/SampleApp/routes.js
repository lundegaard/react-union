/* eslint-disable babel/new-cap */
import Loadable from 'react-loadable';

export default [
	{
		path: 'hero',
		component: Loadable({
			loader: () => import('../../widgets/Hero/components/Root'),
			loading: () => null,
		}),
	},
	{
		path: 'content',
		component: Loadable({
			loader: () => import('../../widgets/Content/components/Root'),
			loading: () => null,
		}),
	},
];
