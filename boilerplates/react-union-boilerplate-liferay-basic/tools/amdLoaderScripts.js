/* eslint-disable no-console */
const fs = require('fs-extra'); // eslint-disable-line import/no-extraneous-dependencies
const mkdirp = require('mkdirp'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path'); // eslint-disable-line import/no-extraneous-dependencies
const rimraf = require('rimraf'); // eslint-disable-line import/no-extraneous-dependencies

const appBundleName = process.argv[2];
const appBundleFileName = `${appBundleName}.js`;
const vendorBundleName = 'vendor';
const vendorBundleFileName = `${vendorBundleName}.js`;
const manifestFileName = 'assetManifest.json';

const appDirectory = fs.realpathSync(process.cwd());
const buildFolder = path.join(appDirectory, 'build', appBundleName);
const jsBuildFolder = path.join(buildFolder, 'js');
const targetFolder = path.join(appDirectory, 'build/loader');
const targetJSFolder = path.join(targetFolder, 'js');
const configFilePath = path.join(targetFolder, 'config.js');
const manifestFilePath = path.join(buildFolder, manifestFileName);

function createLiferayConfigChunk({ name, path = null, dependencies = [] }) {
	const fullPath = path ? path : name;

	return `Liferay.Loader.addModule(
  {
    dependencies: ${JSON.stringify(dependencies)},
		name: ${JSON.stringify(name)},
		exports: ${JSON.stringify(name)},
    path: MODULE_PATH + "/${fullPath}",
  }
);`;
}

function createLiferayConfig() {
	fs.readFile(manifestFilePath, 'utf8', (err, data) => {
		if (err) {
			throw new Error('Manifest file with js bundle map is missing!');
		}

		const manifest = JSON.parse(data);
		mkdirp.sync(targetFolder);

		const vendorBundlePath = manifest[vendorBundleFileName];
		const appBundlePath = manifest[appBundleFileName];

		const writeStream = fs.createWriteStream(configFilePath);
		const moduleDependencies = vendorBundlePath ? ['vendor-module'] : [];

		if (vendorBundlePath) {
			writeStream.write(
				createLiferayConfigChunk({
					name: 'vendor-module',
					path: vendorBundlePath,
				})
			);
			writeStream.write('\n');
		}

		writeStream.write(
			createLiferayConfigChunk({
				name: 'entry-module',
				path: appBundlePath,
				dependencies: moduleDependencies,
			})
		);

		writeStream.end();
	});
}

function copyAssets() {
	mkdirp.sync(targetJSFolder);
	fs.copySync(path.join(jsBuildFolder), path.join(targetJSFolder));
}

console.log('🚀 AMD loader config creator script start');
console.log(`cleaning ${targetFolder} folder`);
rimraf.sync(targetFolder, {}, null);
console.log('creating liferay amd module loader config');
createLiferayConfig();
console.log('copying assets');
copyAssets();
console.log('✨ post build script finished');
