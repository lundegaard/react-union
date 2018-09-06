import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import map from 'ramda/src/map';
import applySpec from 'ramda/src/applySpec';

const selectWidgetDescriptorElements = parent => parent.querySelectorAll('[data-union-widget]');
const selectCommonDescriptorElements = parent => parent.querySelectorAll('[data-union-common]');

const dangerouslyParseJsonContent = o(unary(JSON.parse), prop('innerHTML'));

const parseJsonContent = element => {
	try {
		return dangerouslyParseJsonContent(element);
	} catch (error) {
		if (element.innerHTML.trim()) {
			throw error;
		}

		return {};
	}
};

const parseWidgetDescriptorElement = applySpec({
	widget: path(['dataset', 'unionWidget']),
	container: path(['dataset', 'unionContainer']),
	namespace: path(['dataset', 'unionNamespace']),
	data: parseJsonContent,
});

export const getWidgetDescriptors = o(
	map(parseWidgetDescriptorElement),
	selectWidgetDescriptorElements
);

export const getCommonDescriptors = o(map(parseJsonContent), selectCommonDescriptorElements);
