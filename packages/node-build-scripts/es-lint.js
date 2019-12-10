#!/usr/bin/env node

/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Runs TSLint, with support for generating JUnit report
 */

// @ts-check
"use strict";

const path = require("path");
const fs = require("fs");
const { junitReportPath } = require("./utils");
const { spawn, execSync } = require('child_process');
const glob = require("glob");

let format = "codeframe";
let out;
let outputStream = process.stdout;
if (process.env.JUNIT_REPORT_PATH != null) {
    format = "junit";
    out = junitReportPath("eslint");
    console.info(`TSLint report will appear in ${out}`);
    outputStream = fs.createWriteStream(out, { flags: "w+" });
}

const gitRoot = execSync("git rev-parse --show-toplevel").toString().trim();
const commandLineOptions = ["-c", path.join(gitRoot, "./.eslintrc.json"), "-f", format, "--color"];
if (process.argv.includes("--fix")) {
    commandLineOptions.push("--fix")
}

const fileGlob = "{src, test}/**/*.tsx";
const absoluteFileGlob = path.resolve(process.cwd(), fileGlob);
const anyFilesToLint = glob.sync(absoluteFileGlob)
if (anyFilesToLint.length === 0) {
    console.log("Not running ESLint because no files match the glob ")
    process.exit();
}

const eslint = spawn("eslint", [...commandLineOptions, absoluteFileGlob]);

eslint.stdout.pipe(outputStream);
eslint.stderr.pipe(process.stderr);

eslint.on('close', code => {
    process.exitCode = code;
})
