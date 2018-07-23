import o from 'ramda/src/o';
import unary from 'ramda/src/unary';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import map from 'ramda/src/map';
import tryCatch from 'ramda/src/tryCatch';
import always from 'ramda/src/always';

const selectDescriptorElements = parent => parent.querySelectorAll('[data-union-widget]');

const dangerouslyParseJsonContent = o(unary(JSON.parse), prop('innerHTML'));

const parseJsonContent = tryCatch(dangerouslyParseJsonContent, always({}));

const parseDescriptorElement = element => ({
	name: path(['dataset', 'unionWidget'], element),
	container: path(['dataset', 'unionContainer'], element),
	namespace: path(['dataset', 'unionNamespace'], element),
	data: parseJsonContent(element),
});

const getDescriptors = o(map(parseDescriptorElement), selectDescriptorElements);

export default getDescriptors;
