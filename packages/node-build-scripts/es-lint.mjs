#!/usr/bin/env node
/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 */

/**
 * @fileoverview Runs ESLint, with support for generating JUnit report
 */

// @ts-check

import { ESLint } from "eslint";
import { globSync } from "glob";
import { createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { argv, cwd, env, exit } from "node:process";

import { junitReportPath } from "./src/utils.mjs";

env.LINT_SCRIPT = "true";

const FILES_GLOB = "{src,test}/**/*.{ts,tsx}";
const absoluteFileGlob = resolve(cwd(), FILES_GLOB);

// ESLint may fail if provided with no files, so we expand the glob before running it
const anyFilesToLint = globSync(absoluteFileGlob);
if (anyFilesToLint.length === 0) {
    console.log(`[node-build-scripts] Not running ESLint because no files match the glob "${FILES_GLOB}"`);
    exit();
}

let formatterName = "codeframe";
let outputPath;
if (env.JUNIT_REPORT_PATH != null) {
    formatterName = "junit";
    outputPath = junitReportPath("eslint");
    console.info(`[node-build-scripts] ESLint report will appear in ${outputPath}`);
}

const fix = argv.includes("--fix");
const eslint = new ESLint({ fix });

try {
    console.info(`[node-build-scripts] Running ESLint on ${absoluteFileGlob}`);
    const results = await eslint.lintFiles([absoluteFileGlob]);

    if (fix) {
        console.info(`[node-build-scripts] Applying ESLint auto-fixes...`);
        await ESLint.outputFixes(results);
    }

    const formatter = await eslint.loadFormatter(formatterName);
    const resultText = formatter.format(results);

    if (outputPath !== undefined) {
        const outputStream = createWriteStream(outputPath);
        outputStream.write(resultText);
        outputStream.close();
    } else {
        console.log(resultText);
    }
} catch (error) {
    process.exitCode = 1;
    console.error(`[node-build-scripts] ESLint failed with error: ${error}`);
}
