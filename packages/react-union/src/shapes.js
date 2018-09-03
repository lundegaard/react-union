import PropTypes from 'prop-types';

export const RouteShape = {
	component: PropTypes.func.isRequired,
	path: PropTypes.string.isRequired,
};

export const ConfigShape = {
	component: PropTypes.func.isRequired,
	descriptor: PropTypes.shape({
		container: PropTypes.string,
		data: PropTypes.object,
		namespace: PropTypes.string,
		widget: PropTypes.string.isRequired,
	}).isRequired,
	initialProps: PropTypes.object,
};
