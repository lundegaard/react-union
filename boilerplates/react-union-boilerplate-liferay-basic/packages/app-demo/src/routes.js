import loadHero from '@union-app/widget-hero';
import loadContent from '@union-app/widget-content';

export default [
	{
		path: 'hero',
		getComponent(done) {
			loadHero(mod => done(mod.default));
		},
	},
	{
		path: 'content',
		getComponent(done) {
			loadContent(mod => done(mod.default));
		},
	},
];
