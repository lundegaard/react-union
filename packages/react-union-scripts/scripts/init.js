const chalk = require('chalk');
var ncp = require('ncp').ncp;
const path = require('path');
const fs = require('fs');

const inquirer = require('./lib/inquirer');
const dir = require('./lib/dir');

const setUpAndStart = () => {
	//run yarn to install
	//run yarn start (with adequate parameters)
};

const copyBoilerplate = res => {
	const boilerplateName = res.boilerplate.toLowerCase();
	const baseFolder = `react-union-boilerplate-${boilerplateName}`;
	const source = path.resolve(dir.getBoilerplatesDir(), baseFolder);
	const destination = process.cwd();

	ncp.limit = 16;

	//omit copying node modules
	const options = {
		filter: new RegExp('^((?!node_modules).)*$'),
	};

	ncp(source, destination, options, function(err) {
		if (err) {
			return console.error(err);
		}
		console.log(chalk.green('Boilerplate succesfully created!'));
	});
};

function initBoilerplate(result) {
	console.log(chalk.yellow(`Initializing ${result.boilerplate} example in ${process.cwd()}`));
	copyBoilerplate(result);
	setUpAndStart();
}

const createPromise = func => {
	return new Promise(resolve => {
		const run = async () => {
			const setup = await func();
			return setup;
		};
		resolve(run());
	});
};

function init() {
	// get user input - project + boilerplate
	return createPromise(inquirer.initSetup).then(result => {
		// check root dir
		if (dir.isCwdEmpty()) {
			dir.createDirectoryAndCd(result);
			initBoilerplate(result);
		} else {
			console.log(chalk.yellow(`- Base directory ${process.cwd()} is not empty.`));

			return createPromise(inquirer.yesno).then(yesno => {
				if (yesno.answer === 'Yes') {
					dir.createDirectoryAndCd(result);

					if (dir.isCwdEmpty()) {
						initBoilerplate(result);
					} else {
						console.log(chalk.yellow(`- Project directory ${process.cwd()} is not empty.`));
						console.log(chalk.yellow("- Proceeding will delete folder's content"));

						return createPromise(inquirer.yesno).then(ans => {
							if (ans.answer === 'Yes') {
								// TODO: remove content of directory

								initBoilerplate(result);
							} else {
								console.log(chalk.red('- Cancelling the installation'));
							}
						});
					}
				} else {
					console.log(chalk.red('- Cancelling installation'));
				}
			});
		}
	});
}

module.exports = init;
