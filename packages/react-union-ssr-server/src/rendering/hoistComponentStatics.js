const R = require('ramda');
const { rejectNil } = require('ramda-extension');

const hoistComponentStatics = R.compose(
	R.forEach(R.call(R.__)),
	rejectNil,
	R.map(R.path(['component', 'preloadWeak']))
);

module.exports = hoistComponentStatics;
