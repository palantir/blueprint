#!/usr/bin/env node
/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import autoprefixer from "autoprefixer";
import fs from "fs-extra";
import { basename, extname, join } from "node:path";
import { argv } from "node:process";
import postcss from "postcss";
import postcssDiscardComments from "postcss-discard-comments";
import yargs from "yargs";

// slice off two args which are `node` CLI and this script's name
const truncatedArgv = argv.slice(2);

const args = yargs(truncatedArgv)
    .positional("input", { type: "string", description: "Input folder containing CSS to compile for distribution" })
    .option("output", {
        alias: "o",
        type: "string",
        description: "Output folder (defaults to same as input folder)",
    })
    .check(argv => {
        const hasOneStringArgument = argv._.length === 1 && typeof argv._[0] === "string";
        return hasOneStringArgument;
    })
    .parseSync();

/** @type {string} */
// @ts-ignore - we know this is a string because of the yargs constraint
const inputFolder = args._[0];
const outputFolder = inputFolder ?? "lib/css/";

/**
 * PostCSS processor with plugins enabled.
 *
 * @see https://postcss.org/api/
 * @see https://github.com/postcss/autoprefixer#javascript
 * @see https://github.com/cssnano/cssnano/blob/master/packages/postcss-discard-comments/README.md
 */
const processor = postcss([autoprefixer(), postcssDiscardComments()]);
await compileAllFiles();

async function compileAllFiles() {
    const files = fs.readdirSync(inputFolder);
    const inputFilePaths = files.filter(file => extname(file) === ".css").map(fileName => join(inputFolder, fileName));

    await Promise.all(inputFilePaths.map(compileFile));
    console.info(`[css-dist] Finished compiling all input .css files.`);
}

/**
 * @param {string} inputFilePath
 */
async function compileFile(inputFilePath) {
    const css = fs.readFileSync(inputFilePath, "utf8");
    const outputFilePath = join(outputFolder, basename(inputFilePath));
    try {
        const result = await processor.process(css, {
            from: inputFilePath,
            to: outputFilePath,
            map: {
                inline: false,
                prev: file => `${file}.map`,
                sourcesContent: true,
            },
        });
        fs.outputFileSync(outputFilePath, result.toString());
        if (result.map != null) {
            fs.outputFileSync(`${outputFilePath}.map`, result.map.toString(), { flag: "w" });
        }
    } catch (error) {
        console.error(`[css-dist] Failed to compile ${inputFilePath}: ${error}`);
    }
}
