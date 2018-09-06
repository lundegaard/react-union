import { mergeData } from '../utils';

const { getWidgetDescriptors, getCommonDescriptors } = process.env.BROWSER
	? require('./dom')
	: require('./cheerio');

const scan = parent => {
	const widgetDescriptors = getWidgetDescriptors(parent);
	const commonDescriptors = getCommonDescriptors(parent);

	return {
		commonData: mergeData(commonDescriptors),
		widgetDescriptors,
	};
};

export default scan;
