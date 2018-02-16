import loadWidget from './hero.widget';

export default {
	path: 'hero',
	getComponent: done => {
		loadWidget(mod => done(mod.default));
	},
};
