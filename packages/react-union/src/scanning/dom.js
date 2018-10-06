import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import map from 'ramda/src/map';
import applySpec from 'ramda/src/applySpec';

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
