const { always, compose, equals, findIndex, ifElse, when, nth, identity } = require('ramda');
const { toPascalCase, includes, notInclude } = require('ramda-extension');

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
const programIncludes = includes(program);
const programNotInclude = notInclude(program);

/** optimize for development */
const debug = programNotInclude('--release');

/** level of debugging messages */
const verbose = programIncludes('--verbose');

/** if true, create proxy */
const proxy = programIncludes('--proxy');

/** if true, do not suport HMR */
const noHmr = !debug || programIncludes('--no-hmr');

/** if true, runs analyze tool  */
const analyze = programIncludes('--analyze');

/** if exist, runs single app. Value is converted from dash-case to PascalCase. */
const app = when(Boolean, toPascalCase)(getArgValue('--app', program));

/** if exist, runs single app. Value is provided as is in original form */
const appOriginal = when(Boolean, identity)(getArgValue('--app', program));

const target = getArgValue('--target', program);

const script = nth(2)(program);

module.exports = { script, target, debug, verbose, proxy, noHmr, analyze, app, appOriginal };
