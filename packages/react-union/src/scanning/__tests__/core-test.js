import React from 'react';
import { JSDOM } from 'jsdom';
import scan from '../core';

const createDocument = (data = '', additionalStuff = '') => {
	const { document } = new JSDOM(
		`<!DOCTYPE html>
			<html>
				<body>
				<script
					data-union-widget="hero"
					data-union-container="hero"
					data-union-namespace="main"
					type="application/json"
				>
					${data}
				</script>
				${additionalStuff}
				</body>
			<html>`
	).window;
	return document;
};

describe('scan', () => {
	it('should get descriptor for hero route', async () => {
		const descriptor = await scan(
			[
				{
					path: 'hero',
					component: null,
				},
			],
			createDocument().body
		);
		expect(descriptor[0].descriptor).toEqual({
			container: 'hero',
			data: {},
			widget: 'hero',
			namespace: 'main',
		});
	});
	it('should get parsed data for descriptor', async () => {
		const descriptor = await scan(
			[
				{
					path: 'hero',
					component: null,
				},
			],
			createDocument('{ "foo": "bar"}').body
		);
		expect(descriptor[0].descriptor.data).toEqual({ foo: 'bar' });
	});
	it('should get resolved component from descriptor', async () => {
		const DummyComponent = () => <div />;
		const descriptor = await scan(
			[
				{
					path: 'hero',
					component: DummyComponent,
				},
			],
			createDocument('{ "foo": "bar"}').body
		);
		expect(descriptor[0].component).toBe(DummyComponent);
	});
	it('should throw error when some descriptor is not in routes', () => {
		const DummyComponent = () => <div />;
		expect(() =>
			scan(
				[
					{
						path: 'hero',
						getComponent: DummyComponent,
					},
					{
						path: 'content',
						getComponent: DummyComponent,
					},
				],
				createDocument(
					'',
					`
				<script
					data-union-widget="missing"
					data-union-container="missing"
					type="application/json"
				></script>
				<script
					data-union-widget="content"
					data-union-container="content"
					type="application/json"
				></script>
				`
				).body
			)
		).toThrowError();
	});
});
