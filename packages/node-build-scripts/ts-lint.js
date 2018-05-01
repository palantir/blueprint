#!/usr/bin/env node

/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
