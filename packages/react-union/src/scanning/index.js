import applySpec from 'ramda/src/applySpec';

import { IS_SERVER } from '../constants';
import * as DOM from './dom';
import * as Cheerio from './cheerio';

const { getWidgetDescriptors, getCommonDescriptors } = IS_SERVER ? Cheerio : DOM;

const scan = applySpec({
	commonDescriptors: getCommonDescriptors,
	widgetDescriptors: getWidgetDescriptors,
});

export default scan;
