#!/usr/bin/env node

/**
 * @license Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Runs ESLint, with support for generating JUnit report
 */

// @ts-check
"use strict";

const path = require("path");
const fs = require("fs");
const { junitReportPath } = require("./utils");
const { spawn, execSync } = require("child_process");
const glob = require("glob");

let format = "codeframe";
let out;
let outputStream = process.stdout;
if (process.env.JUNIT_REPORT_PATH != null) {
    format = "junit";
    out = junitReportPath("eslint");
    console.info(`ESLint report will appear in ${out}`);
    outputStream = fs.createWriteStream(out, { flags: "w+" });
}

const gitRoot = execSync("git rev-parse --show-toplevel").toString().trim();
const commandLineOptions = ["-c", path.join(gitRoot, "./.eslintrc.json"), "--color", "-f", format];
if (process.argv.includes("--fix")) {
    commandLineOptions.push("--fix")
}

// ESLint will fail if provided with no files, so we expand the glob before running it
const fileGlob = "{src,test}/**/*.{ts,tsx}";
const absoluteFileGlob = path.resolve(process.cwd(), fileGlob);
const anyFilesToLint = glob.sync(absoluteFileGlob)
if (anyFilesToLint.length === 0) {
    console.log(`Not running ESLint because no files match the glob "${fileGlob}"`)
    process.exit();
}

const eslint = spawn("eslint", [...commandLineOptions, absoluteFileGlob]);

eslint.stdout.pipe(outputStream);
eslint.stderr.pipe(process.stderr);

eslint.on("close", code => {
    process.exitCode = code;
});
