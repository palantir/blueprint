/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { watch } from "chokidar";
import fsExtra from "fs-extra";
import { basename, dirname, extname, join, parse as parsePath, relative, resolve } from "node:path";
import { argv } from "node:process";
import sass from "sass";
import { SourceMapGenerator } from "source-map-js";
import yargs from "yargs";

import nodeModulesSassImporter from "./sass/nodeModulesSassImporter.mjs";
import defaultCustomFunctions from "./sass/sassCustomFunctions.mjs";

// slice off two args which are `node` CLI and this script's name
const truncatedArgv = argv.slice(2);

const args = yargs(truncatedArgv)
    .positional("input", { type: "string", description: "Input folder containing scss to compile" })
    .option("functions", {
        type: "string",
        description: "Path to file with exported custom sass functions",
    })
    .option("output", { alias: "o", type: "string", description: "Output folder" })
    .option("watch", { alias: "w", type: "boolean", description: "Watch mode" })
    .check(argv => {
        const hasOneStringArgument = argv._.length === 1 && typeof argv._[0] === "string";
        return hasOneStringArgument;
    })
    .parseSync();

/** @type {string} */
// @ts-ignore
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

    const outFile = join(args.output, `${parsePath(inputFilePath).name}.css`);
    const outputMapFile = `${outFile}.map`;
    const result = await sass.compileAsync(inputFilePath, {
        importers: [nodeModulesSassImporter],
        sourceMap: true,
        functions: {
            ...defaultCustomFunctions,
            // custom functions specified as CLI args are allowed to override our default ones
            ...cliCustomFunctions,
        },
        charset: true,
    });
    fsExtra.outputFileSync(outFile, result.css, { flag: "w" });
    if (result.sourceMap != null) {
        fsExtra.outputFileSync(
            outputMapFile,
            fixSourcePathsInSourceMap({ outputMapFile, rawSourceMap: result.sourceMap }),
            {
                flag: "w",
            },
        );
    }
}

/**
 *
 * @param {{ outputMapFile: string, rawSourceMap: import("source-map").RawSourceMap }} param0
 * @returns {string}
 */
function fixSourcePathsInSourceMap({ outputMapFile, rawSourceMap }) {
    rawSourceMap.sources = rawSourceMap.sources.map(source => {
        const outputDirectory = dirname(outputMapFile);
        const pathToSourceWithoutProtocol = source.replace("file://", "");
        return relative(outputDirectory, pathToSourceWithoutProtocol);
    });
    return new SourceMapGenerator(rawSourceMap).toString();
}
