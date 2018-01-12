import loadWidget from './hero.widget';

export default {
	path: 'hero',
	getComponents: (cb) => {
		loadWidget((module) => cb(module.default));
	},
};
