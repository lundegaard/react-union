const R = require('ramda');
const { normalizeConfig, UNION_CONFIG_PATH } = require('../utils');

describe('normalizeConfig', () => {
	describe('works with array', () => {
		it("supports shorten syntax with string representing app's name", () => {
			expect(normalizeConfig(['app', { name: 'app2' }])).toEqual([
				{ name: 'app' },
				{ name: 'app2' },
			]);
		});
	});

	describe('works with object', () => {
		it("supports shorten syntax with string representing app's name", () => {
			expect(normalizeConfig({ apps: ['app', { name: 'app2' }] })).toEqual([
				{ name: 'app' },
				{ name: 'app2' },
			]);
		});

		it('copies config from config root to each app config', () => {
			expect(normalizeConfig({ a: 1, apps: ['app', { name: 'app2', a: 2 }] })).toEqual([
				{ name: 'app', a: 1 },
				{ name: 'app2', a: 2 },
			]);
		});
	});
});

describe('getUnionConfig', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	const mockUnionConfig = (config, dirs, cli = {}) => {
		jest.doMock('fs', () => ({ existsSync: R.always(true) }));
		jest.doMock('../cli', () => cli);
		jest.doMock('../fs');

		require('../fs').__setMockDirs(dirs);

		const { getUnionConfig } = require('../utils');
		jest.doMock(UNION_CONFIG_PATH, () => config, { virtual: true });

		return getUnionConfig;
	};

	it('throws error when config is invalid', () => {
		const getUnionConfig = mockUnionConfig([{}], null);

		expect(() => {
			getUnionConfig();
		}).toThrowError("Property 'name' is not specified for one of the apps.");
	});

	describe('supports union.config to export function', () => {
		it('evaluates function', () => {
			const getUnionConfig = mockUnionConfig(() => ['a']);
			const result = getUnionConfig();

			expect(R.length(result)).toBe(1);
			expect(R.head(result).name).toBe('a');
		});

		it('evaluates function with console params', () => {
			const mockCli = {};
			const mockConfig = cli => (expect(cli).toBe(mockCli), ['a']);
			const getUnionConfig = mockUnionConfig(mockConfig, undefined, mockCli);

			getUnionConfig();
		});
	});

	describe('defaulting app names from `paths.public` directory should work when', () => {
		it('there is no config', () => {
			const getUnionConfig = mockUnionConfig(null, ['a']);

			const result = getUnionConfig();

			expect(R.length(result)).toBe(1);
			expect(R.head(result).name).toBe('a');
		});

		it('config file is an empty array', () => {
			const getUnionConfig = mockUnionConfig([], ['a']);

			const result = getUnionConfig();

			expect(R.length(result)).toBe(1);
			expect(R.head(result).name).toBe('a');
		});

		it('config file is an object without `apps` property', () => {
			const getUnionConfig = mockUnionConfig({ foo: 'bar' }, ['a']);

			const result = getUnionConfig();

			expect(R.length(result)).toBe(1);
			expect(R.head(result).name).toEqual('a');
		});
	});
});
