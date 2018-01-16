import React from 'react';
import sd from 'skin-deep';

import Root from '../Root';

describe('Root', () => {
	it('should exist', () => {
		expect(Root).toBeDefined();
	});

	it('should render static text content', () => {
		const tree = sd.shallowRender(<Root />);

		expect(tree.text()).toBe('I am Hero!');
	});
});
