const R = require('ramda');
const R_ = require('ramda-extension');
const fs = require('fs');
const invariant = require('invariant');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require('glob');

const intoArray = R.into([]);

const writeFile = (file, contents) =>
	new Promise((resolve, reject) => {
		fs.writeFile(file, contents, 'utf8', err => (err ? reject(err) : resolve()));
	});

const makeDir = name =>
	new Promise((resolve, reject) => {
		mkdirp(name, err => (err ? reject(err) : resolve()));
	});

const isDirectory = source => fs.lstatSync(source).isDirectory();

const readDirs = dir =>
	fs.existsSync(dir)
		? R.compose(R.filter(name => isDirectory(path.join(dir, name))), fs.readdirSync)(dir)
		: [];

const resolveSymlink = (...args) => fs.realpathSync(path.resolve(...args));

const readEncodedFile = file => fs.readFileSync(file, { encoding: 'utf8' });

const getRootPackageJSON = R_.memoizeWithIdentity(() =>
	JSON.parse(readEncodedFile(path.join(process.cwd(), 'package.json')))
);

const readAllWorkspacesFlatten = R_.memoizeWithIdentity(() =>
	R.o(R.flatten, R.map(glob.sync))(getWorkspacesPatterns())
);

const readPackagesJSONOnPathsTransducer = R.o(R.map(readEncodedFile), R.map(JSON.parse));

const getWorkspacesPatterns = () => {
	const rootPackage = getRootPackageJSON();
	return rootPackage.private && rootPackage.workspaces;
};

const resolveWorkspacesPackagePattern = R.cond([
	[R.is(RegExp), R.identity],
	[R_.isString, pattern => R_.constructRegExp(pattern, 'i')],
	[R_.isArray, pattern => R_.constructRegExp(`(${R.join('|', pattern)})`, 'i')],
	[
		R.T,
		() =>
			invariant(
				false,
				"Invalid property 'appPattern' or 'widgetPattern'. It should be string or list of strings."
			),
	],
]);

const readAllAppsFromWorkspaces = appPattern =>
	intoArray(
		R.o(
			R.map(R.o(R.last, R.split('/'))),
			R.filter(R.test(resolveWorkspacesPackagePattern(appPattern)))
		)
	)(readAllWorkspacesFlatten());

const getAppPath = name => R.find(R.contains(name), readAllWorkspacesFlatten());
const getAppPackageJSON = name => {
	const filterByAppName = R.filter(R.contains(name));
	return R.o(R.head, intoArray(R.o(filterByAppName, readPackagesJSONOnPathsTransducer)))(
		getAllWorkspacesWithFullPathSuffixed('package.json')
	);
};

const getAllWorkspacesWithFullPathSuffixed = (suffix = '') =>
	R.map(pkg => path.resolve(process.cwd(), pkg, suffix), readAllWorkspacesFlatten());

module.exports = {
	isDirectory,
	readDirs,
	writeFile,
	makeDir,
	getRootPackageJSON,
	getWorkspacesPatterns,
	readAllAppsFromWorkspaces,
	getAppPath,
	resolveSymlink,
	readAllWorkspacesFlatten,
	getAllWorkspacesWithFullPathSuffixed,
	readPackagesJSONOnPathsTransducer,
	getAppPackageJSON,
	resolveWorkspacesPackagePattern,
};
