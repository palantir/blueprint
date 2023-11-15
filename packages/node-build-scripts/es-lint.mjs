#!/usr/bin/env node
/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 */

/**
 * @fileoverview Runs ESLint, with support for generating JUnit report
 */

// @ts-check

import { ESLint } from "eslint";
import { ensureDirSync, writeFileSync } from "fs-extra";
import { globSync } from "glob";
import { dirname, resolve } from "node:path";
import { argv, cwd, env } from "node:process";

import { junitReportPath } from "./src/utils.mjs";

main();

async function main() {
    env.LINT_SCRIPT = "true";

    const FILES_GLOB = "{src,test}/**/*.{ts,tsx}";
    const absoluteFileGlob = resolve(cwd(), FILES_GLOB);

    // ESLint may fail if provided with no files, so we expand the glob before running it
    const anyFilesToLint = globSync(absoluteFileGlob);
    if (anyFilesToLint.length === 0) {
        console.log(`[node-build-scripts/es-lint] Not running ESLint because no files match the glob "${FILES_GLOB}"`);
        return;
    }

    let formatterName = "codeframe";
    const outputReportPath = junitReportPath("eslint");
    if (outputReportPath !== undefined) {
        formatterName = "junit";
        ensureDirSync(dirname(outputReportPath));
        console.info(`[node-build-scripts/es-lint] ESLint report will appear in ${outputReportPath}`);
    }

    const fix = argv.includes("--fix");
    const eslint = new ESLint({ fix });

    try {
        console.info(`[node-build-scripts/es-lint] Running ESLint on ${absoluteFileGlob}`);
        const results = await eslint.lintFiles([absoluteFileGlob]);
        const hasAnyErrors = results.some(result => result.errorCount > 0);
        const hasNonFixableErrors = results.some(result => result.errorCount > result.fixableErrorCount);

        if (fix) {
            console.info(`[node-build-scripts/es-lint] Applying ESLint auto-fixes...`);
            await ESLint.outputFixes(results);
            process.exitCode = hasNonFixableErrors ? 1 : 0;
        } else {
            process.exitCode = hasAnyErrors ? 1 : 0;
        }

        const formatter = await eslint.loadFormatter(formatterName);
        const resultText = await formatter.format(results);

        if (outputReportPath !== undefined) {
            writeFileSync(outputReportPath, resultText);
        } else {
            console.log(resultText);
        }
        console.info(
            `[node-build-scripts/es-lint] Done running ESLint, with ${process.exitCode === 0 ? "no" : "some"} errors.`,
        );
    } catch (error) {
        process.exitCode = 1;
        console.error(`[node-build-scripts/es-lint] ESLint failed with error: ${error}`);
    }
}
