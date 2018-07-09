import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import tryCatch from 'ramda/src/tryCatch';
import always from 'ramda/src/always';
import { mergeDeepRightAll } from '../../utils';

const dangerouslyParseJsonContent = o(unary(JSON.parse), wrapper => wrapper.html());

const parseJsonContent = tryCatch(dangerouslyParseJsonContent, always({}));

const parseDescriptor = wrapper => ({
	name: wrapper.data('union-widget'),
	container: wrapper.data('union-container'),
	namespace: wrapper.data('union-namespace'),
	data: parseJsonContent(wrapper),
});

export const getWidgetDescriptors = $ =>
	$('[data-union-widget]')
		.map((_, element) => parseDescriptor($(element)))
		.get();

export const getCommonData = $ =>
	mergeDeepRightAll(
		$('[data-union-common]')
			.map((_, element) => parseJsonContent($(element)))
			.get()
	);
