import PropTypes from 'prop-types';

export const RouteShape = {
	getComponent: PropTypes.func.isRequired,
	path: PropTypes.string.isRequired,
};

export const ConfigShape = {
	descriptor: PropTypes.shape({
		container: PropTypes.string,
		data: PropTypes.object,
		namespace: PropTypes.string,
		widget: PropTypes.string.isRequired,
	}).isRequired,
	// covers both class and functional components
	component: PropTypes.func.isRequired,
};
