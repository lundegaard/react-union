import { mergeData } from '../utils';

import * as DOM from './dom';
import * as Cheerio from './cheerio';

const { getWidgetDescriptors, getCommonDescriptors } =
	typeof document === 'undefined' ? Cheerio : DOM;

const scan = parent => {
	const widgetDescriptors = getWidgetDescriptors(parent);
	const commonDescriptors = getCommonDescriptors(parent);

	return {
		commonData: mergeData(commonDescriptors),
		widgetDescriptors,
	};
};

export default scan;
