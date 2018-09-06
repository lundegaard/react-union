import forEach from 'ramda/src/forEach';

import { mergeDeepRightAll, invariant } from '../utils';

const { getWidgetDescriptors, getCommonDescriptors } = process.env.BROWSER
	? require('./dom')
	: require('./cheerio');

const validateDescriptorStructures = forEach(({ widget, namespace, container }) => {
	invariant(
		namespace || container,
		`Missing required attributes for the widget "${widget}". ` +
			'Fill "data-union-namespace" or "data-union-container" in the widget descriptor.'
	);
});

const scan = parent => {
	const widgetDescriptors = getWidgetDescriptors(parent);
	const commonDescriptors = getCommonDescriptors(parent);

	validateDescriptorStructures(widgetDescriptors);

	return {
		commonData: mergeDeepRightAll(commonDescriptors),
		widgetDescriptors,
	};
};

export default scan;
