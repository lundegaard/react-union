export const INVALID_JSON = 'INVALID_JSON';

export const IS_SERVER = Boolean(
	typeof process !== 'undefined' && process.versions && process.versions.node
);

export const SHOULD_NOT_LEAK =
	typeof process !== 'undefined' && process.env.NODE_ENV === 'production' && !IS_SERVER;

export const RESCAN = 'react-union/rescan';
