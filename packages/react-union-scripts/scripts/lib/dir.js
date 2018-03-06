const fs = require('fs');
const path = require('path');

module.exports = {
	getBoilerplatesDir: () => {
		return path.resolve(__dirname, '..', '..', '..', '..', 'boilerplates');
	},

	createDirectoryAndCd: result => {
		if (!fs.existsSync(result.project)) fs.mkdirSync(result.project);
		process.chdir(result.project);
	},

	isCwdEmpty: () => {
		const files = fs.readdirSync(process.cwd());
		if (files.filter(x => x !== '.git').length) {
			return false;
		} else {
			return true;
		}
	},
};
