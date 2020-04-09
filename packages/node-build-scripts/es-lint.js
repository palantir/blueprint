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
const { execSync, spawn } = require("child_process");
const glob = require("glob");

const IGNORE_FILE_NAME = ".eslintignore";

let format = "codeframe";
let out;
let outputStream = process.stdout;
if (process.env.JUNIT_REPORT_PATH != null) {
    format = "junit";
    out = junitReportPath("eslint");
    console.info(`ESLint report will appear in ${out}`);
    outputStream = fs.createWriteStream(out, { flags: "w+" });
}

// additional args provided to es-lint script
const additionalArgs = process.argv.filter(a => {
    // exclude engine and script name
    return ["node", "es-lint"].every(s => path.basename(a) !== s);
});

// by default, ESLint only looks for .eslintignore in the current directory, but it might exist at the project root
const ignoreFilepath = findIgnoreFile();
if (ignoreFilepath !== undefined) {
    additionalArgs.push("--ignore-path", ignoreFilepath);
}

const commandLineOptions = ["--color", "-f", format, ...additionalArgs];

// ESLint will fail if provided with no files, so we expand the glob before running it
const fileGlob = "{src,test}/**/*.{ts,tsx}";
const absoluteFileGlob = path.resolve(process.cwd(), fileGlob);
const anyFilesToLint = glob.sync(absoluteFileGlob)
if (anyFilesToLint.length === 0) {
    console.log(`[node-build-scripts] Not running ESLint because no files match the glob "${fileGlob}"`)
    process.exit();
}

const eslint = spawn("eslint", [...commandLineOptions, absoluteFileGlob]);

eslint.stdout.pipe(outputStream);
eslint.stderr.pipe(process.stderr);

eslint.on("close", code => {
    process.exitCode = code;
});

function findIgnoreFile() {
    if (fs.existsSync(path.join(process.cwd(), IGNORE_FILE_NAME))) {
        return undefined;
    }

    const gitRoot = execSync("git rev-parse --show-toplevel").toString().trim();
    const rootIgnoreFilepath = path.join(gitRoot, IGNORE_FILE_NAME);
    if (fs.existsSync(rootIgnoreFilepath)) {
        console.log(`[node-build-scripts] Using ESLint ignore file path ${rootIgnoreFilepath}`)
        return rootIgnoreFilepath;
    }

    return undefined;
}
