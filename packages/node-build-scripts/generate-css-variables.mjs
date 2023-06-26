#!/usr/bin/env node
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { ensureDirSync } from "fs-extra";
import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { argv, cwd } from "node:process";
import yargs from "yargs/yargs";

import { generateLessVariables, generateScssVariables, getParsedVars } from "./src/cssVariables.mjs";

const SRC_DIR = resolve(cwd(), "./src");
const LIB_DIR = resolve(cwd(), "./lib");

await main();

async function main() {
    const args = yargs(argv.slice(2))
        .option("outputFileName", {
            alias: "o",
            default: "variables",
            type: "string",
            description: "The file name for the generated less and scss files",
        })
        .option("retainDefault", {
            default: false,
            type: "boolean",
            description: "Set to true to retain the !default syntax for the generated scss file",
        }).argv;

    const outputFilename = args["outputFileName"];
    const parsedInput = await getParsedVars(SRC_DIR, args["_"]);

    const scssVariables = generateScssVariables(parsedInput, args["retainDefault"]);
    const outputScssDir = join(LIB_DIR, "scss");
    ensureDirSync(outputScssDir);
    writeFileSync(`${outputScssDir}/${outputFilename}.scss`, scssVariables);

    const lessVariables = generateLessVariables(parsedInput);
    const outputLessDir = join(LIB_DIR, "less");
    ensureDirSync(outputLessDir);
    writeFileSync(`${outputLessDir}/${outputFilename}.less`, lessVariables);
}
