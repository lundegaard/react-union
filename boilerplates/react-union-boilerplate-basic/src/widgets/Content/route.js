import loadWidget from './content.widget';

export default {
	path: 'content',
	getComponent: done => {
		loadWidget(mod => done(mod.default));
	},
};
