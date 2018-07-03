const R_ = require('ramda-extension');

const createMockRootPkgJSON = (
	content = { name: 'foo', workspaces: ['packages/*'], private: true }
) => {
	const mockReadFileSync = jest.fn(() => JSON.stringify(content));
	jest.doMock('fs', () => ({
		readFileSync: mockReadFileSync,
	}));
	return mockReadFileSync;
};

const createMockGlob = (...results) => {
	const defaultedResults =
		results.length === 0
			? [['package/union-app-sample-app', 'package/union-widget-sample-widget']]
			: results;
	const mockGlob = jest.fn();
	defaultedResults.forEach(result => {
		mockGlob.mockImplementationOnce(() => result);
	});
	jest.doMock('glob', () => ({
		sync: mockGlob,
	}));
	return mockGlob;
};

describe('fs', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.resetModules();
	});
	describe('getRootPackageJSON', () => {
		it('should get root pkg.json and convert it into json', () => {
			const mockFs = createMockRootPkgJSON();
			const utilsFs = require('../fs');
			expect(utilsFs.getRootPackageJSON()).toMatchObject({ name: 'foo' });
			expect(mockFs).toHaveBeenCalledWith(`${process.cwd()}/package.json`, expect.anything());
		});
		it('should call readFile only once and memoize it', () => {
			const mockFs = createMockRootPkgJSON();
			const utilsFs = require('../fs');
			utilsFs.getRootPackageJSON();
			utilsFs.getRootPackageJSON();
			utilsFs.getRootPackageJSON();
			expect(mockFs).toHaveBeenCalledTimes(1);
		});
	});
	describe('getWorkspacesPatterns', () => {
		it('should get workspaces if is private and has them', () => {
			createMockRootPkgJSON();
			const utilsFs = require('../fs');
			expect(utilsFs.getWorkspacesPatterns()).toEqual(['packages/*']);
		});
		it('should return false when pkg is not private', () => {
			createMockRootPkgJSON({ private: false });
			const utilsFs = require('../fs');
			expect(utilsFs.getWorkspacesPatterns()).toBeFalsy();
		});
	});
	describe('readAllWorkspacesFlatten', () => {
		it('should get all dirs from workspaces and flatten them', () => {
			createMockRootPkgJSON({ private: true, workspaces: ['packages/*', 'widgets/*'] });
			const mockGlob = createMockGlob(['package/a', 'package/b'], ['widget/a']);
			const utilsFs = require('../fs');
			expect(utilsFs.readAllWorkspacesFlatten()).toEqual(['package/a', 'package/b', 'widget/a']);
			expect(mockGlob).toHaveBeenNthCalledWith(1, 'packages/*');
			expect(mockGlob).toHaveBeenNthCalledWith(2, 'widgets/*');
		});
	});
	describe('getAppPath', () => {
		it('should get app path for given app name', () => {
			createMockRootPkgJSON();
			createMockGlob();
			const utilsFs = require('../fs');
			expect(utilsFs.getAppPath('union-app-sample-app')).toEqual('package/union-app-sample-app');
			expect(utilsFs.getAppPath('union-app-sample-app')).toEqual('package/union-app-sample-app');
		});
	});
	describe('getAllWorkspacesWithFullPathSuffixed', () => {
		it('should get full path of all packages in workspaces with custom suffix', () => {
			createMockRootPkgJSON();
			createMockGlob();
			const utilsFs = require('../fs');
			expect(utilsFs.getAllWorkspacesWithFullPathSuffixed('src')).toEqual(
				['package/union-app-sample-app/src', 'package/union-widget-sample-widget/src'].map(
					entry => `${process.cwd()}/${entry}`
				)
			);
		});
	});
	describe('getAppPackageJSON', () => {
		it('should get packageJSON of concrete app', () => {
			const pkgJson = {
				name: 'union-app-sample-app',
				private: true,
				workspaces: ['packages/*'],
			};
			createMockRootPkgJSON(pkgJson);
			createMockGlob();
			const utilsFs = require('../fs');
			expect(utilsFs.getAppPackageJSON('union-app-sample-app')).toEqual(pkgJson);
		});
	});
	describe('resolveWorkspacesPackagePattern', () => {
		it('should return unchanged regexp when is regexp', () => {
			const reg = /ahoj/;
			const utilsFs = require('../fs');
			expect(utilsFs.resolveWorkspacesPackagePattern(reg)).toBe(reg);
		});
		it('should return regexp constructed from string', () => {
			const expected = R_.constructRegExp('ahoj', 'i');
			const utilsFs = require('../fs');
			expect(utilsFs.resolveWorkspacesPackagePattern('ahoj')).toEqual(expected);
		});
		it('should return regexp constructed from array of strings', () => {
			const expected = R_.constructRegExp('(ahoj|ahoj|ahoj)', 'i');
			const utilsFs = require('../fs');
			expect(utilsFs.resolveWorkspacesPackagePattern(['ahoj', 'ahoj', 'ahoj'])).toEqual(expected);
		});
		it('should throw error when is something different', () => {
			const utilsFs = require('../fs');
			expect(() => {
				utilsFs.resolveWorkspacesPackagePattern({}).toThrowError();
			});
		});
	});
	describe('readAllAppsFromWorkspaces', () => {
		it('should read all apps from workspaces with omitted prefix', () => {
			createMockRootPkgJSON();
			createMockGlob([
				'package/union-app-test',
				'package/union-app-test1',
				'package/union-widget-test',
			]);
			const utilsFs = require('../fs');
			// appPattern is taken by default from somewhere else. And resolving patter has different test.
			// so one test here is sufficient
			expect(utilsFs.readAllAppsFromWorkspaces('union-app')).toEqual([
				'union-app-test',
				'union-app-test1',
			]);
		});
	});
	describe('readAllNonUnionPackages', () => {
		it('should read all non union packages from workspace', () => {
			createMockRootPkgJSON();
			createMockGlob([
				'package/union-app-test',
				'package/union-app-test1',
				'package/union-widget-test',
				'package/custom-pkg',
			]);
			const utilsFs = require('../fs');
			expect(utilsFs.readAllNonUnionPackages('union-app', 'union-widget')).toEqual(['custom-pkg']);
		});
	});
});
