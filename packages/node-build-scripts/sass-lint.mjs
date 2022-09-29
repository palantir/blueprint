#!/usr/bin/env node
/**
 * @license Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Runs stylelint, with support for generating JUnit report
 */

// @ts-check

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import stylelint from "stylelint";

import { junitReportPath } from "./utils.mjs";

const emitReport = process.env.JUNIT_REPORT_PATH != null;

/** Path to Stylelint config file */
const configFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..", ".stylelintrc");

stylelint
    .lint({
        configFile,
        files: "src/**/*.scss",
        formatter: emitReport ? require("stylelint-junit-formatter") : "string",
        customSyntax: "postcss-scss",
        fix: process.argv.indexOf("--fix") > 0,
    })
    .then(resultObject => {
        if (emitReport) {
            // emit JUnit XML report to <cwd>/<reports>/<pkg>/stylelint.xml when this env variable is set
            const reportPath = junitReportPath("stylelint");
            console.info(`Stylelint report will appear in ${reportPath}`);
            // @ts-ignore
            fs.writeFileSync(reportPath, resultObject.output);
        } else {
            console.info(resultObject.output);
        }
        if (resultObject.errored) {
            process.exitCode = 2;
        }
    })
    .catch(error => {
        console.error("[node-build-scripts] sass-lint failed with error:");
        console.error(error);
        process.exitCode = 2;
    });
