import PropTypes from 'prop-types';

export const RouteShape = {
	component: PropTypes.func.isRequired,
	path: PropTypes.string.isRequired,
};

export const ConfigShape = {
	descriptor: PropTypes.shape({
		name: PropTypes.string.isRequired,
		container: PropTypes.string,
		namespace: PropTypes.string,
	}).isRequired,
	// covers both class and functional components
	component: PropTypes.func.isRequired,
};
