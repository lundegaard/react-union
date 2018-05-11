import loadHeroWidget from '../../widgets/Hero/hero.widget';
import loadContentWidget from '../../widgets/Content/content.widget';

export default [
	{
		path: 'hero',
		getComponent(done) {
			loadHeroWidget(mod => done(mod.default));
		},
	},
	{
		path: 'content',
		getComponent(done) {
			loadContentWidget(mod => done(mod.default));
		},
	},
];
