import loadHero from 'widget-hero';
import loadContent from 'widget-content';

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
