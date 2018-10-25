/* eslint-disable no-console */
const fs = require('fs-extra'); // eslint-disable-line import/no-extraneous-dependencies
const mkdirp = require('mkdirp'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path'); // eslint-disable-line import/no-extraneous-dependencies
const rimraf = require('rimraf'); // eslint-disable-line import/no-extraneous-dependencies
const glob = require('glob'); // eslint-disable-line import/no-extraneous-dependencies
const R = require('ramda'); // eslint-disable-line import/no-extraneous-dependencies
const R_ = require('ramda-extension'); // eslint-disable-line import/no-extraneous-dependencies

const appDirectory = fs.realpathSync(process.cwd());
const srcPackagesFolder = path.join(appDirectory, 'packages');

const getAvailableApps = R.compose(
	R.map(R.unary(path.basename)),
	R.curryN(2, glob.sync)
);

const DEBUG = !process.argv.includes('--release');

const vendorBundleName = 'vendor';
const vendorBundleFileName = `${vendorBundleName}.js`;
const manifestFileName = 'assetManifest.json';

const buildFolder = path.join(appDirectory, 'build');
const targetFolder = path.join(appDirectory, 'liferay/amd-loader/src/main/resources/META-INF/resources');
const configFilePath = path.join(targetFolder, 'config.js');

const joinNonEmpty = xs => xs.filter(Boolean).join('.');
const getLfrFilePath = (appName, hash) =>
	path.join(targetFolder, `${joinNonEmpty([appName, hash])}.js`);
const getLfrContextPath = (appName, hash) =>
	`/o/liferay-amd-loader/${joinNonEmpty([appName, hash])}.js`;

function createLiferayConfigSource({ name, exportsObject, path = null, dependencies = [] }) {
	return `Liferay.Loader.addModule({
	dependencies: ${JSON.stringify(dependencies)},
	name: ${JSON.stringify(name)},
	exports: ${JSON.stringify(exportsObject)},
	path: ${JSON.stringify(path || name)},
	type: 'js'
});\n`;
}

function getEntryBundlesFromManifest({ currentApp, manifest }) {
	return R.filter(Boolean, {
		vendor: manifest[vendorBundleFileName],
		app: manifest[`${currentApp}.js`],
	});
}

function getHashPart(x) {
	return x ? x.split('.')[1] : '';
}

/**
 * Hash is sum of hash of entry and vendor bundle
 */
function getHash(ctx) {
	if (DEBUG) {
		return '';
	}

	const paths = getEntryBundlesFromManifest(ctx);

	return `${getHashPart(paths.app)}${getHashPart(paths.vendor)}`;
}

const getLoadScriptsSrc = R.o(R.values, R.map(x => `Liferay.Loader._loadScript({ url: '${x}' });`));

const joinByNewLine = R.join('\n');

function getLoaderSource(ctx) {
	const paths = getEntryBundlesFromManifest(ctx);
	const loadScripts = getLoadScriptsSrc(paths);

	return `${joinByNewLine(loadScripts)}\nwindow.${ctx.appExports} = {};\n`;
}

function createLiferayConfig() {
	mkdirp.sync(targetFolder);

	const appsAvailable = getAvailableApps('**/app-*/', {
		cwd: srcPackagesFolder,
		ignore: ['node_modules/**'],
	});

	R.forEach(currentApp => {
		const manifestFilePath = path.join(buildFolder, currentApp, manifestFileName);
		const manifest = fs.readJsonSync(manifestFilePath, 'utf8');

		const ctx = {
			currentApp,
			appExports: R_.toCamelCase(currentApp),
			manifest,
			appsAvailable,
		};
		const hash = getHash(ctx);

		fs.writeFileSync(getLfrFilePath(currentApp, hash), getLoaderSource(ctx), 'utf8');

		fs.appendFileSync(
			configFilePath,
			createLiferayConfigSource({
				name: currentApp,
				exportsObject: ctx.appExports,
				path: getLfrContextPath(currentApp, hash),
			}),
			'utf8'
		);

		fs.copySync(
			path.join(buildFolder, currentApp, 'js'),
			path.join(targetFolder, currentApp, 'js')
		);
	})(appsAvailable);
}

console.log('🚀 Starting creation of Liferay AMD 🚀');
console.log(`Cleaning ${targetFolder} folder...`);
rimraf.sync(targetFolder, {}, null);
console.log('Creating Liferay AMD configuration...');
createLiferayConfig();
console.log('✨ Successfully finished ✨');
