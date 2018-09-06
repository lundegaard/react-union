import React from 'react';
import { shallow } from 'enzyme';
import { Widget } from '../src/components/Widget';

const DummyComponent = () => <div />;

global.document.getElementById = id => {
	if (id === 'hero') {
		return document.createElement('div');
	}
};

describe('<Widget />', () => {
	it('should throw error when WidgetComponent is missing', () => {
		expect(() => shallow(<Widget />)).toThrowError();
	});
	it('should throw error when container is missing', () => {
		expect(() => shallow(<Widget component={DummyComponent} />)).toThrowError();
	});
});
