const fs = require('fs');
const mkdirp = require('mkdirp');

const writeFile = (file, contents) => new Promise((resolve, reject) => {
	fs.writeFile(file, contents, 'utf8', (err) => err ? reject(err) : resolve());
});

const makeDir = (name) => new Promise((resolve, reject) => {
	mkdirp(name, (err) => err ? reject(err) : resolve());
});

module.exports = { writeFile, makeDir };
