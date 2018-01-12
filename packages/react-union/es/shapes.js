import PropTypes from 'prop-types';

export var RouteShape = {
	container: PropTypes.string,
	path: PropTypes.string.isRequired
};

export var ConfigShape = {
	mark: PropTypes.shape({
		name: PropTypes.string.isRequired,
		container: PropTypes.string,
		namespace: PropTypes.string
	}),
	component: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};