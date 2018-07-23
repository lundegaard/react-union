import React from 'react';
import { mount } from 'enzyme';

const mockWidget = jest.fn();
jest.mock('../../Widget', () => {
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

const scanResult = [
	{
		component: DummyComponent,
		descriptor: {
			container: 'hero',
			name: 'hero',
			data: {},
			namespace: undefined,
		},
	},
];

const mockUnion = (res = scanResult) => {
	const scanFn = jest.fn(() => res);
	jest.doMock('../../../scanning', () => scanFn);
	const Union = require('../Union').default;

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
	it.only('should call onScanError when error happens in scan', async () => {
		jest.doMock('../../../scanning', () => () => {
			throw 'error';
		});
		const Union = require('../Union').default;
		const onScanError = jest.fn();
		await mount(<Union routes={routes} strictMode={false} onScanError={onScanError} />);
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
		expect(wrapper.state()).toEqual({ configs: scanResult });
	});
	it('should render widget with props from config', async () => {
		const mock = mockUnion();
		await mount(<mock.Union routes={routes} strictMode={false} />);
		expect(mockWidget).toHaveBeenCalledWith(scanResult[0]);
	});
});
