#!/usr/bin/env node

/**
 * @license Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Runs stylelint, with support for generating JUnit report
 */

// @ts-check
const fs = require("fs");
const path = require("path");
const stylelint = require("stylelint");
const { junitReportPath } = require("./utils");

const emitReport = process.env.JUNIT_REPORT_PATH != null;

const options = {
    configFile: path.resolve(__dirname, "../..", ".stylelintrc"),
    files: "src/**/*.scss",
    formatter: emitReport ? require("stylelint-junit-formatter") : "string",
    syntax: "scss",
    fix: process.argv.indexOf("--fix") > 0,
};

stylelint.lint(options).then(resultObject => {
    if (emitReport) {
        // emit JUnit XML report to <cwd>/<reports>/<pkg>/stylelint.xml when this env variable is set
        const reportPath = junitReportPath("stylelint");
        console.info(`Stylelint report will appear in ${reportPath}`);
        fs.writeFileSync(reportPath, resultObject.output);
    } else {
        console.info(resultObject.output);
    }
    if (resultObject.errored) {
        process.exitCode = 2;
    }
});
