import { SHOULD_NOT_LEAK } from './constants';

export const warning = (pred, msg) => {
	if (pred) {
		return;
	}

	if (SHOULD_NOT_LEAK) {
		return;
	}

	console.log(msg);
};

export const invariant = (pred, msg) => {
	if (pred) {
		return;
	}

	if (SHOULD_NOT_LEAK) {
		throw new Error('There was an error. Use non-production build to see details.');
	}

	throw new Error(msg);
};

export const getDisplayName = Component => Component.displayName || Component.name || 'Component';
