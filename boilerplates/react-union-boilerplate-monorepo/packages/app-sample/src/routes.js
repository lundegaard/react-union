import loadHeroWidget from '@union-app/widget-hero';
import loadContentWidget from '@union-app/widget-content';

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
