export const INVALID_JSON = 'INVALID_JSON';

export const SHOULD_NOT_LEAK =
	process.env.NODE_ENV === 'production' && typeof document !== 'undefined';
