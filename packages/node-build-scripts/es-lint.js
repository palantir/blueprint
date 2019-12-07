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
const { spawn } = require('child_process');

let format = "codeframe";
let out;
let outputStream = process.stdout;
if (process.env.JUNIT_REPORT_PATH != null) {
    format = "junit";
    out = junitReportPath("eslint");
    console.info(`TSLint report will appear in ${out}`);
    outputStream = fs.createWriteStream(out, { flags: "w+" });
}

const commandLineOptions = ["-c", "../../.eslintrc.json", "-f", format, "--color"];
if (process.argv.includes("--fix")) {
    commandLineOptions.push("--fix")
}
const eslint = spawn("eslint", [...commandLineOptions, path.resolve(process.cwd(),"{src,test}/**/*.tsx")]);

eslint.stdout.pipe(outputStream);
eslint.stderr.pipe(process.stderr);

eslint.on('close', code => {
    process.exitCode = code;
})
