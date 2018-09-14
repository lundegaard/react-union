const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const execCommand = (command, opts = {}) =>
	execSync(command, { stdio, encoding: 'UTF-8', ...opts });

// ;;; CONSTANTS

const stdio = ['inherit', 'pipe', 'inherit'];
const customRegistryUrl = 'http://localhost:4873';
const originalNpmRegistryUrl = execCommand('npm get registry');
const originalYarnRegistryUrl = execCommand('yarn config get registry');
console.log('backing up original registry', originalNpmRegistryUrl, originalYarnRegistryUrl);

// ;;; HELPER FUNCTIONS

const logSegment = msg => console.log(';;;', msg);
const logTask = (msg, ...args) => console.log('	-', msg, ...args);

const logDone = (...args) => console.log(';;; DONE', ...args);

const checkIfBuildIsPresent = () => {
	const unionPath = folder => path.join(process.cwd(), 'packages', 'react-union', folder);
	const buildFolders = ['dist', 'es', 'lib'].map(unionPath);
	// will throw error when folder not found
	buildFolders.forEach(fs.accessSync);
	buildFolders.forEach(folder => {
		if (fs.readdirSync(folder).length === 0) {
			throw new Error(`build directory ${folder} is empty`);
		}
	});
};

const runVerdaccio = registryDir =>
	new Promise(resolve => {
		logTask('starting verdaccio, wait a moment');
		fs.mkdirSync(registryDir);
		fs.copyFileSync(
			path.join(process.cwd(), 'scripts', 'CI', 'verdaccio.yaml'),
			`${registryDir}/verdaccio.yaml`
		);
		const verdaccio = spawn('npx', ['verdaccio@3.2.0', '-c', 'verdaccio.yaml'], {
			cwd: registryDir,
		});
		verdaccio.stdout.on('data', data => {
			if (data.toString('utf8').includes('http address')) {
				logTask('verdaccio successfully started');
				resolve(verdaccio);
			}
		});
		verdaccio.stderr.on('data', data => {
			console.log('@verdaccio stderr =>', data.toString('utf8'));
		});
	});

const publishReactUnion = async tempDir => {
	const registryDir = path.join(tempDir, 'registry');

	const verdaccioProcess = await runVerdaccio(registryDir);
	execCommand(`npm set registry ${customRegistryUrl}`);
	execCommand(
		`cd && npx npm-auth-to-token@1.0.0 -u user -p password -e user@example.com -r ${customRegistryUrl}`
	);
	execCommand(
		// eslint-disable-next-line max-len
		'npm run publishAll -- --skip-git --yes --force-publish=* --exact --cd-version=prerelease'
	);
	execCommand(`npm set registry ${originalNpmRegistryUrl}`);

	return verdaccioProcess;
};

const cleanup = verdaccio => {
	logSegment('CLEAN UP');
	// show no mercy
	// eslint-disable-next-line no-unused-expressions
	verdaccio && verdaccio.kill();
	execCommand(`yarn config set registry ${originalYarnRegistryUrl}`);
	execCommand(`npm set registry ${originalNpmRegistryUrl}`);
	logDone();
};

(async () => {
	let verdaccioProcess = undefined;
	try {
		logSegment('INSTALL REPO');
		execCommand('yarn');
		execCommand('yarn run test --ci');
		execCommand('yarn run lint', { stdio: 'inherit' });
		logDone();
		logSegment('CHECK INTEGRITY OF REACT-UNION BUILD');
		checkIfBuildIsPresent();
		logDone();

		logSegment('CREATE TEMP DIR FOR ADVANCE TESTING');
		const createTempDir = "mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'";
		const tempDir = execCommand(createTempDir).trim();
		logDone(tempDir);

		logSegment('PUBLISH REACT-UNION TO TEMP REGISTRY');
		verdaccioProcess = await publishReactUnion(tempDir);
		logDone();
		logSegment('TEST BOILERPLATES');
		logTask('copy them to the temp location');
		execCommand(`rsync --exclude=node_modules -av --progress boilerplates ${tempDir}`);
		const boilerplateDir = path.join(tempDir, 'boilerplates');
		fs.readdirSync(boilerplateDir).forEach(project => {
			const projectPath = path.join(boilerplateDir, project);
			logTask('bootstrapping', projectPath);
			const execCommandInProject = (command, opts = {}) =>
				execCommand(command, {
					cwd: projectPath,
					...opts,
				});
			execCommandInProject(`yarn config set registry ${customRegistryUrl}`);
			execCommandInProject(`npm set registry ${customRegistryUrl}`);
			execCommandInProject('yarn');
			execCommandInProject(`yarn config set registry ${originalYarnRegistryUrl}`);
			execCommandInProject(`npm set registry ${originalNpmRegistryUrl}`);
			logTask('running test&lint');
			execCommandInProject('yarn test --release');
			logTask('webpack build');
			const webpackOut = execCommandInProject('yarn build --release');
			console.log('@webpack stdout', webpackOut);
			if (webpackOut.includes('ERROR') | webpackOut.includes('WARNING')) {
				throw new Error('webpack compilation error');
			}
		});
		logDone();
	} catch (e) {
		console.log('!!! YOU RUINED IT !!!');
		cleanup(verdaccioProcess);
		process.exit(1);
		throw e;
	}
	cleanup(verdaccioProcess);
	process.exit(0);
})();
