import PropTypes from 'prop-types';

export const RouteShape = {
	component: PropTypes.func.isRequired,
	path: PropTypes.string.isRequired,
};

export const WidgetDescriptorShape = {
	container: PropTypes.string,
	data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	namespace: PropTypes.string,
	widget: PropTypes.string.isRequired,
};

export const WidgetConfigShape = {
	// NOTE: The reason for this shallow structure is that we merge `commonData` into `data`.
	// If we were changing `descriptor.data` under the hood, it would be misleading.
	...WidgetDescriptorShape,
	component: PropTypes.func.isRequired,
	// NOTE: We added `isRequired` to avoid using `namespace || container` everywhere.
	namespace: PropTypes.string.isRequired,
};
