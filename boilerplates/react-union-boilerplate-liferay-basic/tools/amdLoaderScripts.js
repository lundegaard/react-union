const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');
const glob = require('glob');
const R = require('ramda');
const R_ = require('ramda-extension');

const appDirectory = fs.realpathSync(process.cwd());
const srcPackagesDirectory = path.join(appDirectory, 'packages');

const getAvailableApps = R.compose(
	R.map(R.unary(path.basename)),
	R.curryN(2, glob.sync)
);

const DEBUG = !process.argv.includes('--release');

const vendorFileName = 'vendor.js';
const runtimeFileName = 'runtime.js';
const mainFileName = 'main.js';
const manifestFileName = 'assetManifest.json';

const buildDirectory = path.join(appDirectory, 'build');
const targetDirectory = path.join(
	appDirectory,
	'liferay/amd-loader/src/main/resources/META-INF/resources'
);
const configFilePath = path.join(targetDirectory, 'config.js');

const joinNonEmpty = xs => xs.filter(Boolean).join('.');

const getLiferayFilePath = (appName, hash) =>
	path.join(targetDirectory, `${joinNonEmpty([appName, hash])}.js`);

const getLiferayContextPath = (appName, hash) =>
	`/o/liferay-amd-loader/${joinNonEmpty([appName, hash])}.js`;

function createLiferayConfigSource({ name, exportsIdentifier, path = null, dependencies = [] }) {
	return `Liferay.Loader.addModule({
	dependencies: ${JSON.stringify(dependencies)},
	name: ${JSON.stringify(name)},
	exports: ${JSON.stringify(exportsIdentifier)},
	path: ${JSON.stringify(path || name)},
	type: 'js'
});\n`;
}

function getEntryBundlesFromManifest(manifest) {
	return R.filter(Boolean, {
		runtime: manifest[runtimeFileName],
		vendor: manifest[vendorFileName],
		app: manifest[mainFileName],
	});
}

function getHashPart(x) {
	return x ? x.split('.')[1] : '';
}

function getHash(appName, manifest) {
	if (DEBUG) {
		return '';
	}

	const paths = getEntryBundlesFromManifest(manifest);

	return `${getHashPart(paths.app)}${getHashPart(paths.vendor)}${getHashPart(paths.runtime)}`;
}

const getLoadScriptsSrc = R.o(R.values, R.map(x => `Liferay.Loader._loadScript({ url: '${x}' });`));

const joinByNewline = R.join('\n');

function getLoaderSource(appName, manifest) {
	const paths = getEntryBundlesFromManifest(manifest);
	const loadScripts = getLoadScriptsSrc(paths);

	return `${joinByNewline(loadScripts)}\nwindow.${R_.toCamelCase(appName)} = {};\n`;
}

function createLiferayConfig() {
	mkdirp.sync(targetDirectory);

	const appsAvailable = getAvailableApps('**/app-*/', {
		cwd: srcPackagesDirectory,
		ignore: ['node_modules/**'],
	});

	R.forEach(appName => {
		const manifestFilePath = path.join(buildDirectory, appName, manifestFileName);
		const manifest = fs.readJsonSync(manifestFilePath, 'utf8');
		const hash = getHash(appName, manifest);

		fs.writeFileSync(getLiferayFilePath(appName, hash), getLoaderSource(appName, manifest), 'utf8');

		fs.appendFileSync(
			configFilePath,
			createLiferayConfigSource({
				name: appName,
				exportsIdentifier: R_.toCamelCase(appName),
				path: getLiferayContextPath(appName, hash),
			}),
			'utf8'
		);

		fs.copySync(buildDirectory, targetDirectory);
	})(appsAvailable);
}

console.log('🚀 Starting Liferay AMD loader scripts 🚀');
console.log(`Cleaning ${targetDirectory} directory...`);
rimraf.sync(targetDirectory, {}, null);
console.log('Creating Liferay AMD configuration...');
createLiferayConfig();
console.log('✨ Successfully finished ✨');
