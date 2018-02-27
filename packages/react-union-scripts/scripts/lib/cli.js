const { always, compose, equals, findIndex, ifElse, when, nth } = require('ramda');

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
const getArgValue = (arg, program) =>
	compose(ifElse(equals(-1), always(null), x => program[x + 1]), findIndex(equals(arg)))(program);

const program = process.argv;

/** optimize for development */
const debug = !program.includes('--release');

/** level of debugging messages */
const verbose = program.includes('--verbose');

/** if true, create proxy */
const proxy = program.includes('--proxy');

/** if true, do not suport HMR */
const noHmr = !debug || program.includes('--no-hmr');

/** if true, runs analyze tool  */
const analyze = program.includes('--analyze');

/** if exist, runs single app. Value is converted from dash-case to PascalCase. */
const app = when(Boolean, pascalize)(getArgValue('--app', program));

const target = getArgValue('--target', program);

const script = nth(3)(program);

module.exports = { script, target, debug, verbose, proxy, noHmr, analyze, app };
