#!/usr/bin/env node
/**
 * @license Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Runs ESLint, with support for generating JUnit report
 */

// @ts-check

import { spawn } from "cross-spawn";
import glob from "glob";
import { createWriteStream } from "node:fs";
import { basename, resolve } from "node:path";
import { argv, cwd, env, exit, stderr, stdout } from "node:process";

import { junitReportPath } from "./src/utils.mjs";

let format = "codeframe";
let outputPath;
let outputStream = stdout;
if (env.JUNIT_REPORT_PATH != null) {
    format = "junit";
    outputPath = junitReportPath("eslint");
    console.info(`[node-build-scripts] ESLint report will appear in ${outputPath}`);
    // @ts-ignore
    outputStream = createWriteStream(outputPath, { flags: "w+" });
}

// additional args provided to es-lint script
const additionalArgs = argv.filter(a => {
    // exclude engine and script name
    return ["node", "node.exe", "es-lint", "es-lint.js"].every(s => basename(a) !== s);
});

const commandLineOptions = ["--color", "-f", format, ...additionalArgs];

// ESLint will fail if provided with no files, so we expand the glob before running it
const fileGlob = "{src,test}/**/*.{ts,tsx}";
const absoluteFileGlob = resolve(cwd(), fileGlob);
const anyFilesToLint = glob.sync(absoluteFileGlob);
if (anyFilesToLint.length === 0) {
    console.log(`[node-build-scripts] Not running ESLint because no files match the glob "${fileGlob}"`);
    exit();
}

env.LINT_SCRIPT = "true";

const eslint = spawn("eslint", [...commandLineOptions, absoluteFileGlob]);

eslint.stdout.pipe(outputStream);
eslint.stderr.pipe(stderr);

eslint.on("close", code => {
    exit(code ?? undefined);
});
