import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import applySpec from 'ramda/src/applySpec';

import { INVALID_JSON } from '../constants';

const dangerouslyParseJSONContent = o(unary(JSON.parse), wrapper => wrapper.html());

const parseJSONContent = wrapper => {
	try {
		return dangerouslyParseJSONContent(wrapper);
	} catch (error) {
		if (wrapper.html().trim()) {
			return INVALID_JSON;
		}

		return null;
	}
};

const parseWidgetDescriptorWrapper = wrapper => ({
	widget: wrapper.data('union-widget'),
	container: wrapper.data('union-container'),
	namespace: wrapper.data('union-namespace'),
	data: parseJSONContent(wrapper),
});

export const getWidgetDescriptors = $ =>
	$('[data-union-widget]')
		.map((_, element) => parseWidgetDescriptorWrapper($(element)))
		.get();

const parseCommonDescriptorWrapper = applySpec({
	data: parseJSONContent,
});

export const getCommonDescriptors = $ =>
	$('[data-union-common]')
		.map((_, element) => parseCommonDescriptorWrapper($(element)))
		.get();
