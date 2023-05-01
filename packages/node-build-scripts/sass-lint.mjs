#!/usr/bin/env node
/**
 * @license Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Runs stylelint, with support for generating JUnit report
 */

// @ts-check

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { argv, exit } from "node:process";
import stylelint from "stylelint";
import stylelintJUnitFormater from "stylelint-junit-formatter";

import { getRootDir, junitReportPath } from "./src/utils.mjs";

// emit JUnit XML report to <cwd>/<reports>/<pkg>/stylelint.xml when env.JUNIT_REPORT_PATH is set
const reportPath = junitReportPath("stylelint");

/** Path to Stylelint config file */
const configFile = join(getRootDir(), ".stylelintrc");

stylelint
    .lint({
        configFile,
        files: "src/**/*.scss",
        formatter: reportPath !== undefined ? stylelintJUnitFormater : "string",
        customSyntax: "postcss-scss",
        fix: argv.indexOf("--fix") > 0,
    })
    .then(resultObject => {
        if (reportPath !== undefined) {
            console.info(`Stylelint report will appear in ${reportPath}`);
            writeFileSync(reportPath, resultObject.output);
        } else {
            console.info(resultObject.output);
        }
        if (resultObject.errored) {
            exit(2);
        }
    })
    .catch(error => {
        console.error("[node-build-scripts] sass-lint failed with error:");
        console.error(error);
        exit(2);
    });
