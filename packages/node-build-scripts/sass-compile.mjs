/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { watch } from "chokidar";
import fsExtra from "fs-extra";
import { basename, extname, join, resolve } from "node:path";
import { argv } from "node:process";
import * as sass from "sass";
import yargs from "yargs";

import { sassCompileFile } from "./src/sass/sassCompileFile.mjs";

// slice off two args which are `node` CLI and this script's name
const truncatedArgv = argv.slice(2);

const args = yargs(truncatedArgv)
    .positional("input", { type: "string", description: "Input folder containing scss to compile" })
    .option("functions", {
        type: "string",
        description: "Path to file with exported custom sass functions",
    })
    .option("output", {
        alias: "o",
        type: "string",
        description: "Output folder",
        default: "lib/css/",
    })
    .option("watch", {
        alias: "w",
        type: "boolean",
        description: "Watch mode",
        default: false,
    })
    .check(argv => {
        const hasOneStringArgument = argv._.length === 1 && typeof argv._[0] === "string";
        return hasOneStringArgument;
    })
    .parseSync();

/** @type {string} */
// @ts-ignore - we know this is a string because of the yargs constraint
const inputFolder = args._[0];

/** @type {Record<string, sass.CustomFunction<"async">>} */
const cliCustomFunctions = args.functions != null ? require(resolve(args.functions)) : undefined;

if (args.watch) {
    await compileAllFiles();

    const folderToWatch = resolve(inputFolder);
    console.info(`[sass-compile] Watching ${folderToWatch} for changes...`);

    const watcher = watch([`${folderToWatch}/*.scss`, `${folderToWatch}/**/*.scss`], { persistent: true });
    watcher.on("change", async fileName => {
        console.info(`[sass-compile] Detected change in ${fileName}, re-compiling.`);

        if (basename(fileName).startsWith("_")) {
            await compileAllFiles();
        } else {
            await compileFile(fileName);
        }
    });
} else {
    await compileAllFiles();
}

async function compileAllFiles() {
    const files = fsExtra.readdirSync(inputFolder);
    const inputFilePaths = files
        .filter(file => extname(file) === ".scss" && !basename(file).startsWith("_"))
        .map(fileName => join(inputFolder, fileName));

    await Promise.all(inputFilePaths.map(compileFile));
    console.info("[sass-compile] Finished compiling all input .scss files.");
}

/**
 * @param {string} inputFilePath
 */
async function compileFile(inputFilePath) {
    if (args.output === undefined) {
        throw new Error(`[sass-compile] Output folder must be specified with --output CLI argument.`);
    }

    return sassCompileFile(inputFilePath, args.output, cliCustomFunctions);
}
