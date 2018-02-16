import loadWidget from './content.widget';

export default {
	path: 'content',
	getComponents: cb => {
		loadWidget(module => cb(module.default));
	},
};
