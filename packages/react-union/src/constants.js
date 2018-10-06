export const INVALID_JSON = 'INVALID_JSON';

export const IS_SERVER =
	typeof global !== 'undefined' && {}.toString.call(global) === '[object global]';

export const SHOULD_NOT_LEAK = process.env.NODE_ENV === 'production' && !IS_SERVER;
