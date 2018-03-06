const inquirer = require('inquirer');

module.exports = {
	initSetup: () => {
		const questions = [
			{
				name: 'project',
				type: 'input',
				message: 'Enter project name:',
				validate: function(value) {
					if (value.length) {
						return true;
					} else {
						return 'Please enter project name.';
					}
				},
			},
			{
				name: 'boilerplate',
				type: 'list',
				message: 'Choose the boilerplate:',
				choices: ['Basic', 'Liferay', 'Wordpress'],
			},
		];
		return inquirer.prompt(questions);
	},

	yesno: () => {
		const questions = [
			{
				name: 'answer',
				type: 'list',
				message: 'Do you wish to continue?',
				choices: ['Yes', 'No'],
			},
		];
		return inquirer.prompt(questions);
	},
};
