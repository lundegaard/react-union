import loadWidget from './content.widget';

export default {
	path: 'content',
	getComponent: cb => {
		loadWidget(module => cb(module.default));
	},
};
