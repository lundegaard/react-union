import loadWidget from './hero.widget';

export default {
	path: 'hero',
	getComponent: cb => {
		loadWidget(module => cb(module.default));
	},
};
