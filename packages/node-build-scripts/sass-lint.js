#!/usr/bin/env node

/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

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
};

stylelint.lint(options).then(resultObject => {
    if (emitReport) {
        // emit JUnit XML report to <cwd>/<reports>/<pkg>/stylelint.xml when this env variable is set
        const reportPath = junitReportPath("stylelint");
        console.info(`JUnit report will appear in ${reportPath}`);
        fs.writeFileSync(reportPath, resultObject.output);
    } else {
        console.info(resultObject.output);
    }
    if (resultObject.errored) {
        process.exitCode = 2;
    }
});
