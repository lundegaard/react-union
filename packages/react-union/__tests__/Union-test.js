import React from 'react';
import { mount } from 'enzyme';

const mockWidget = jest.fn();
jest.mock('../src/components/Widget', () => {
	const WidgetMock = ({ ...props }) => {
		mockWidget(props);
		return <div />;
	};
	return WidgetMock;
});

const DummyComponent = () => <div />;

const routes = [
	{
		path: 'hero',
		component: DummyComponent,
	},
];

const scanResult = {
	commonData: {},
	configs: [
		{
			component: DummyComponent,
			descriptor: {
				container: 'hero',
				widget: 'hero',
				data: {},
				namespace: undefined,
			},
		},
	],
};

const mockUnion = (res = scanResult) => {
	const scanFn = jest.fn(() => res);
	jest.doMock('../src/scan', () => scanFn);
	const Union = require('../src/components/Union').default;

	return {
		Union,
		scanFn,
	};
};

describe('<Union />', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.resetModules();
	});
	it('should call onScanStart', async () => {
		const mock = mockUnion();
		const onScanStart = jest.fn();
		await mount(<mock.Union routes={routes} strictMode={false} onScanStart={onScanStart} />);
		expect(onScanStart).toHaveBeenCalled();
	});
	it('should call onScanEnd when successfully scanned with result', async () => {
		const onScanEnd = jest.fn();
		const mock = mockUnion();
		await mount(<mock.Union routes={routes} strictMode={false} onScanEnd={onScanEnd} />);
		expect(onScanEnd).toHaveBeenCalledWith(scanResult);
	});
	it('should call onScanError when error happens in scan', async () => {
		jest.doMock('../../../scanning', () => () => {
			throw 'error';
		});
		const Union = require('../src/components/Union').default;
		const onScanError = jest.fn();

		expect(() =>
			mount(<Union routes={routes} strictMode={false} onScanError={onScanError} />)
		).toThrowError();

		expect(onScanError).toHaveBeenCalledWith('error');
	});
	it('should run scan on did mount', async () => {
		const mock = mockUnion();
		await mount(<mock.Union routes={routes} strictMode={false} />);
		expect(mock.scanFn).toHaveBeenCalled();
	});
	it('should set state with new config', async () => {
		const mock = mockUnion();
		const wrapper = await mount(<mock.Union routes={routes} strictMode={false} />);
		expect(wrapper.state()).toEqual({ ...scanResult, routes });
	});
	it('should render widget with props from config', async () => {
		const mock = mockUnion();
		await mount(<mock.Union routes={routes} strictMode={false} />);
		expect(mockWidget).toHaveBeenCalledWith(scanResult.configs[0]);
	});
});
