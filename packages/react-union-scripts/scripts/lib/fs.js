const R = require('ramda');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

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

module.exports = { isDirectory, readDirs, writeFile, makeDir };
