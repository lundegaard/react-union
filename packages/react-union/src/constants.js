export const INVALID_JSON = 'INVALID_JSON';

export const IS_SERVER = Boolean(process && process.versions && process.versions.node);

export const SHOULD_NOT_LEAK = process.env.NODE_ENV === 'production' && !IS_SERVER;
