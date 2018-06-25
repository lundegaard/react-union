/* eslint-disable import/no-unresolved,import/extensions */
// ESLINT IS DISABLED BECAUSE DEPS ARE NOT RESOLVED IN UNION MONO REPO
import loadHeroWidget from 'union-widget-hero';
import loadContentWidget from 'union-widget-content';

export default [
	{
		path: 'hero',
		getComponent: done => {
			loadHeroWidget(mod => done(mod.default));
		},
	},
	{
		path: 'content',
		getComponent: done => {
			loadContentWidget(mod => done(mod.default));
		},
	},
];
