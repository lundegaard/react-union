import { noop } from 'ramda-extension';

import route from './routing';
import { INVALID_JSON } from './constants';

const routes = [{ path: 'foo', component: noop }, { path: 'bar', component: noop }];

describe('route', () => {
	it('can create simple configs with just widget descriptors', () => {
		const scanResult = {
			commonDescriptors: [],
			widgetDescriptors: [
				{ widget: 'foo', container: 'foo-container' },
				{ widget: 'bar', container: 'bar-container' },
			],
		};

		expect(route(routes, scanResult)).toEqual({
			commonData: {},
			routes,
			scanResult,
			widgetConfigs: [
				{
					component: noop,
					container: 'foo-container',
					data: {},
					namespace: 'foo-container',
					widget: 'foo',
				},
				{
					component: noop,
					container: 'bar-container',
					data: {},
					namespace: 'bar-container',
					widget: 'bar',
				},
			],
		});
	});

	it('merges commonData correctly', () => {
		const data = { foo: 'bar', bar: 'baz' };

		const scanResult = {
			commonDescriptors: [{ data }],
			widgetDescriptors: [{ widget: 'foo', container: 'foo-container', data: { foo: 'YOLO' } }],
		};

		expect(route(routes, scanResult)).toEqual({
			commonData: data,
			routes,
			scanResult,
			widgetConfigs: [
				{
					component: noop,
					container: 'foo-container',
					data: { foo: 'YOLO', bar: 'baz' },
					namespace: 'foo-container',
					widget: 'foo',
				},
			],
		});
	});

	it('throws when a route is missing', () => {
		const scanResult = {
			commonDescriptors: [],
			widgetDescriptors: [{ widget: 'foooooooooo', container: 'foo-container' }],
		};

		expect(() => route(routes, scanResult)).toThrow();
	});

	it('throws when INVALID_JSON is found in a common descriptor', () => {
		const scanResult = {
			commonDescriptors: [{ data: INVALID_JSON }],
			widgetDescriptors: [{ widget: 'foo', container: 'foo-container' }],
		};

		expect(() => route(routes, scanResult)).toThrow();
	});

	it('handles INVALID_JSON in a widget descriptor', () => {
		const scanResult = {
			commonDescriptors: [{ data: { foo: 'bar' } }],
			widgetDescriptors: [{ widget: 'foo', container: 'foo-container', data: INVALID_JSON }],
		};

		expect(route(routes, scanResult)).toEqual({
			commonData: { foo: 'bar' },
			routes,
			scanResult,
			widgetConfigs: [
				{
					component: noop,
					container: 'foo-container',
					data: INVALID_JSON,
					namespace: 'foo-container',
					widget: 'foo',
				},
			],
		});
	});
});
