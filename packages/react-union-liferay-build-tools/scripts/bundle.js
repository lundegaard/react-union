const path = require('path');
const fs = require('fs-extra');
const R = require('ramda');
const execa = require('execa');

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
	fs.readdirSync(source).filter(name => isDirectory(path.join(source, name)));

const appDirectory = fs.realpathSync(process.cwd());

const vendorFileName = 'vendor.js';
const runtimeFileName = 'runtime.js';
const mainFileName = 'main.js';
const manifestFileName = 'assetManifest.json';
const packagesFodler = 'packages';

const buildDirectory = path.join(appDirectory, 'build');

const outputJson = R.curry((path, content) =>
	fs.outputJSON(path, content, {
		spaces: '\t',
		encoding: 'utf8',
	})
);

const getEntryBundlesFromManifest = manifest =>
	R.filter(Boolean, {
		runtime: manifest[runtimeFileName],
		vendor: manifest[vendorFileName],
		app: manifest[mainFileName],
	});

const getLoadScriptsSrc = R.o(
	R.values,
	R.map(
		x => `Liferay.Loader._scriptLoader._loadScript({ url: '${x}', modules: [] });
		`
	)
);

const joinByNewline = R.join('\n');

const getLoaderSource = (appName, manifest) => {
	const paths = getEntryBundlesFromManifest(manifest);
	const loadScripts = getLoadScriptsSrc(paths);

	return `${joinByNewline(loadScripts)}\n`;
};

const lfrBundler = async (cwd = __dirname) =>
	execa('liferay-npm-bundler', [], {
		cwd,
		stdio: 'inherit',
		preferLocal: true,
	});

const getAppPackageJson = async appName =>
	await fs.readJson(path.join(appDirectory, packagesFodler, appName, 'package.json'));

const createLiferayConfig = async () => {
	const appsAvailable = getDirectories(buildDirectory);
	const rootPackageJson = await fs.readJson(path.join(appDirectory, 'package.json'));

	const dist = path.join(appDirectory, 'dist');

	fs.ensureDirSync(dist);

	R.forEach(async appName => {
		const distApp = path.join(dist, appName);
		const distAppBuild = path.join(distApp, 'build');
		const distAppSrc = path.join(distAppBuild, 'build');
		const appPackageJson = await getAppPackageJson(appName);

		const packageJson = appPackageJson ? appPackageJson : rootPackageJson;

		const isManifestProvided = fs.pathExists(path.join(distApp, manifestFileName));

		if (!isManifestProvided) {
			console.warn(`Skipping bundling of ${appName} due to lack of \`assetManifest.json\` file.`);
			return;
		}

		await fs.copy(path.join(buildDirectory, appName), distAppSrc);

		const manifest = await fs.readJson(path.join(distAppSrc, manifestFileName), 'utf8');
		const templateNpmbundlerrc = await fs.readJson(
			path.join(__dirname, '..', 'template-npmbundlerrc.json'),
			'utf8'
		);
		await outputJson(path.join(distApp, 'package.json'), {
			name: appName,
			version: packageJson.version,
			description: packageJson.description,
		});
		await outputJson(
			path.join(distApp, '.npmbundlerrc'),
			R.mergeDeepRight(templateNpmbundlerrc, {
				ignore: ['build/**/*.js'],
				'create-jar': {
					'output-filename': `${appName}.jar`,
					features: {
						'web-context': `/${appName}`,
					},
				},
			})
		);

		fs.writeFileSync(
			path.join(distAppBuild, `${appName}.js`),
			getLoaderSource(appName, manifest),
			'utf8'
		);

		await lfrBundler(distApp);
	})(appsAvailable);
};

async function bundle() {
	console.log('Creating Liferay AMD configuration...');
	await createLiferayConfig();
	console.log('✨ Successfully finished ✨');
}

module.exports = bundle;
