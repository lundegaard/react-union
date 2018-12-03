const R = require('ramda');
const { normalizeConfig, UNION_CONFIG_PATH, mergeWhen } = require('../utils');

describe('utils', () => {
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
		it('should load config for monorepo', () => {
			const utilsFs = require('../fs');
			utilsFs.__setWsPattern(['packages/*']);
			utilsFs.__setWsApps(['sample-app']);
			utilsFs.__setAppPath('packages/sample-app');

			const getUnionConfig = mockUnionConfig(null, ['sample-app'], {
				app: 'sample-app',
			});
			// basically there is no much to check
			// only differences that modules are loaded from workspaces path and has different default paths.
			expect(getUnionConfig()[0].name).toEqual('sample-app');
			expect(getUnionConfig()[0].paths).toEqual({
				build: `${process.cwd()}/build/sample-app`,
				public: `${process.cwd()}/packages/sample-app/public`,
				index: `${process.cwd()}/packages/sample-app/src/index`,
			});
		});
	});

	describe('getForMode', () => {
		beforeEach(() => {
			jest.resetModules();
		});
		it('should return debug when is in debug mode', () => {
			jest.doMock('../cli', () => ({
				debug: true,
			}));
			const { getForMode } = require('../utils');
			expect(getForMode('debug', 'prod')).toEqual('debug');
		});
		it('should return debug when is in debug mode', () => {
			jest.doMock('../cli', () => ({
				debug: false,
			}));
			const { getForMode } = require('../utils');
			expect(getForMode('debug', 'prod')).toEqual('prod');
		});
	});
	describe('mergeWhen', () => {
		it('should fire function with args when condition is met and return res of the function', () => {
			const fn = jest.fn(() => 'res');
			const res = mergeWhen(true, fn, 'a', 'b');
			expect(res).toEqual('res');
			expect(fn).toHaveBeenCalledWith('a', 'b');
		});
		it('should not fire function when condition is unmet and return {}', () => {
			const fn = jest.fn();
			const res = mergeWhen(false, fn, 'a', 'b');
			expect(res).toEqual({});
			expect(fn).not.toHaveBeenCalled();
		});
	});
	describe('getAppConfig', () => {
		beforeEach(() => {
			jest.resetModules();
			jest.resetAllMocks();
			jest.doMock('../fs');
			jest.doMock('../cli', () => ({
				app: 'sample-app',
			}));
			jest.doMock(UNION_CONFIG_PATH, () => null, { virtual: true });
			require('../fs').__setMockDirs(['sample-app']);
		});

		it('should get config when is monorepo by cli.app', () => {
			const utilsFs = require('../fs');
			utilsFs.__setWsPattern(['packages/*']);
			utilsFs.__setWsApps(['sample-app']);
			utilsFs.__setAppPath('packages/sample-app');
			const { getAppConfig } = require('../utils');
			expect(getAppConfig()).toMatchObject({ name: 'sample-app' });
		});
	});
});
