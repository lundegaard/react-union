import PropTypes from 'prop-types';

export const RouteShape = {
	container: PropTypes.string,
	path: PropTypes.string.isRequired,
};

export const ConfigShape = {
	descriptor: PropTypes.shape({
		name: PropTypes.string.isRequired,
		container: PropTypes.string,
		namespace: PropTypes.string,
	}),
	component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};
