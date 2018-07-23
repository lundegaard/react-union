/* eslint-disable babel/new-cap */
import universal from 'react-universal-component';

export default [
	{
		path: 'hero',
		component: universal(() => import('../../widgets/Hero')),
	},
	{
		path: 'content',
		component: universal(() => import('../../widgets/Content')),
	},
];
