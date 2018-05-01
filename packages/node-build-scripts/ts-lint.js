#!/usr/bin/env node

/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Runs TSLint, with support for generating JUnit report
 */

// @ts-check
"use strict";

const fs = require("fs");
const { run } = require("tslint/lib/runner");
const { Configuration } = require("tslint");
const { junitReportPath } = require("./utils");

let format = "codeFrame";
let out;
let outputStream = process.stdout;
if (process.env.JUNIT_REPORT_PATH != null) {
    format = "junit";
    out = junitReportPath("tslint");
    console.info(`TSLint report will appear in ${out}`);
    outputStream = fs.createWriteStream(out, { flags: "w+" });
}

const configFile = Configuration.findConfiguration(null, __dirname).path;

run({
    config: configFile,
    exclude: [],
    files: ["{src,test}/**/*.tsx"],
    fix: "--fix" in process.argv,
    format,
    out,
}, {
    error(m) {
        process.stderr.write(m);
    },
    log(m) {
        outputStream.write(m);
    },
})
.then(status => {
    process.exitCode = status;
})
.catch(e => {
    console.error(e);
    process.exitCode = 1;
});
