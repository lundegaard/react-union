const {
	always,
	compose,
	equals,
	findIndex,
	ifElse,
} = require('ramda');

const { pascalize } = require('humps');

/**
 *
 * @sig String -> [String] -> String
 *
 * @example
 * 		getArgValue(
 * 			'--app',
 * 			[
 * 				"node",
 * 				"node/process-2.js",
 * 				"--app",
 * 				"AppName"
 * 			]
 * 		) // "AppName"
 */
const getArgValue = (arg, program) => compose(
	ifElse(equals(-1), always(null), (x) => program[x + 1]),
	findIndex(equals(arg))
)(program);

const program = process.argv;

/** optimize for development */
const DEBUG = !program.includes('--release');

/** level of debugging messages */
const VERBOSE = program.includes('--verbose');

/** if true, create proxy */
const PROXY = program.includes('--proxy');

/** if true, do not suport HMR */
const NO_HMR = !DEBUG || program.includes('--no-hmr');

/** if true, runs analyze tool  */
const ANALYZE = program.includes('--analyze');

const app = getArgValue('--app', program);

/** if exist, runs single app. Value is converted from dash-case to PascalCase. */
const APP = app ? pascalize(app) : null;

module.exports = { DEBUG, VERBOSE, PROXY, NO_HMR, ANALYZE, APP };
