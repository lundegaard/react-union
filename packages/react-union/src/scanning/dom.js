import { o, unary, prop, path, applySpec, map } from 'ramda';

import { INVALID_JSON } from '../constants';

const selectWidgetDescriptorElements = parent => parent.querySelectorAll('[data-union-widget]');
const selectCommonDescriptorElements = parent => parent.querySelectorAll('[data-union-common]');

const dangerouslyParseJSONContent = o(unary(JSON.parse), prop('innerHTML'));

const parseJSONContent = element => {
	try {
		return dangerouslyParseJSONContent(element);
	} catch (error) {
		if (element.innerHTML.trim()) {
			return INVALID_JSON;
		}

		return null;
	}
};

const parseWidgetDescriptorElement = applySpec({
	widget: path(['dataset', 'unionWidget']),
	container: path(['dataset', 'unionContainer']),
	namespace: path(['dataset', 'unionNamespace']),
	data: parseJSONContent,
});

export const getWidgetDescriptors = o(
	map(parseWidgetDescriptorElement),
	selectWidgetDescriptorElements
);

const parseCommonDescriptorElement = applySpec({
	data: parseJSONContent,
});

export const getCommonDescriptors = o(
	map(parseCommonDescriptorElement),
	selectCommonDescriptorElements
);
