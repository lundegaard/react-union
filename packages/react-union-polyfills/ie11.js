if (typeof Promise === 'undefined') {
	require('promise/lib/rejection-tracking').enable();
	self.Promise = require('promise/lib/es6-extensions.js');
}

if (typeof window !== 'undefined') {
	// fetch() polyfill for making API calls.
	require('whatwg-fetch');
}

Object.assign = require('object-assign');

require('core-js/features/symbol');
require('core-js/features/array/from');
