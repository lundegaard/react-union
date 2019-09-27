const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const R = require('ramda');

const appDirectory = fs.realpathSync(process.cwd());
const srcPackagesDirectory = path.join(appDirectory, 'packages');

const getAvailableApps = R.compose(
	R.map(R.unary(path.basename)),
	R.curryN(2, glob.sync)
);

const vendorFileName = 'vendor.js';
const runtimeFileName = 'runtime.js';
const mainFileName = 'main.js';
const manifestFileName = 'assetManifest.json';

const buildDirectory = path.join(appDirectory, 'build');

const getEntryBundlesFromManifest = manifest =>
	R.filter(Boolean, {
		runtime: manifest[runtimeFileName],
		vendor: manifest[vendorFileName],
		app: manifest[mainFileName],
	});

const getLoadScriptsSrc = R.o(
	R.values,
	R.map(x => `Liferay.Loader._scriptLoader._loadScript({ url: '${x}' });`)
);

const joinByNewline = R.join('\n');

const getLoaderSource = (appName, manifest) => {
	const paths = getEntryBundlesFromManifest(manifest);
	const loadScripts = getLoadScriptsSrc(paths);

	return `${joinByNewline(loadScripts)}\n`;
};

const createLiferayConfig = () => {
	const appsAvailable = getAvailableApps('**/app-*/', {
		cwd: srcPackagesDirectory,
		ignore: ['node_modules/**'],
	});

	R.forEach(appName => {
		const manifestFilePath = path.join(buildDirectory, appName, manifestFileName);
		const manifest = fs.readJsonSync(manifestFilePath, 'utf8');
		// const hash = getHash(appName, manifest);

		fs.writeFileSync(
			path.join(buildDirectory, `${appName}.js`),
			getLoaderSource(appName, manifest),
			'utf8'
		);
	})(appsAvailable);
};

console.log('🚀 Starting Liferay AMD loader scripts 🚀');
console.log('Creating Liferay AMD configuration...');
createLiferayConfig();
console.log('✨ Successfully finished ✨');
