import React from 'react';
import { JSDOM } from 'jsdom';
import scan from '../src/scan';

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
		const { configs } = await scan(
			[
				{
					path: 'hero',
					getComponent: done => {
						done();
					},
				},
			],
			createDocument().body
		);
		expect(configs[0].descriptor).toEqual({
			container: 'hero',
			data: {},
			widget: 'hero',
			namespace: 'main',
		});
	});
	it('should get parsed data for descriptor', async () => {
		const { configs } = await scan(
			[
				{
					path: 'hero',
					getComponent: done => {
						done();
					},
				},
			],
			createDocument('{ "foo": "bar"}').body
		);
		expect(configs[0].descriptor.data).toEqual({ foo: 'bar' });
	});
	it('should get resolved component from descriptor', async () => {
		const DummyComponent = () => <div />;
		const { configs } = await scan(
			[
				{
					path: 'hero',
					getComponent: done => {
						done(DummyComponent);
					},
				},
			],
			createDocument('{ "foo": "bar"}').body
		);
		expect(configs[0].component).toBe(DummyComponent);
	});
	it('should throw error when some descriptor is not in routes', () => {
		const DummyComponent = () => <div />;
		expect(() =>
			scan(
				[
					{
						path: 'hero',
						getComponent: done => {
							done(DummyComponent);
						},
					},
					{
						path: 'content',
						getComponent: done => {
							done(DummyComponent);
						},
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
