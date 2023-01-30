/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { watch } from "chokidar";
import fsExtra from "fs-extra";
import nodeSassPackageImporter from "node-sass-package-importer";
import { basename, dirname, extname, join, parse as parsePath, relative, resolve } from "node:path";
import { argv } from "node:process";
import sass from "sass";
import yargs from "yargs";

import { svgInliner } from "./svg/svgInliner.mjs";

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

const customFunctions = args.functions != null ? require(resolve(args.functions)) : undefined;
const functions = {
    /**
     * Sass function to inline a UI icon svg and change its path color.
     *
     * Usage:
     * svg-icon("16px/icon-name.svg", (path: (fill: $color)) )
     *
     * TODO(adahiya): ensure this works when this script is invoked outside of the Blueprint monorepo?
     */
    "svg-icon($path, $selectors: null)": svgInliner("../../resources/icons", {
        // run through SVGO first
        optimize: true,
        // minimal "uri" encoding is smaller than base64
        encodingFormat: "uri",
    }),

    // custom functions specified as CLI args are allowed to override our default ones
    ...customFunctions,
};

if (args.watch) {
    compileAllFiles();

    const folderToWatch = resolve(inputFolder);
    console.info(`[sass-compile] Watching ${folderToWatch} for changes...`);

    const watcher = watch([`${folderToWatch}/*.scss`, `${folderToWatch}/**/*.scss`], { persistent: true });
    watcher.on("change", fileName => {
        console.info(`[sass-compile] Detected change in ${fileName}, re-compiling.`);

        if (basename(fileName).startsWith("_")) {
            compileAllFiles();
        } else {
            compileFile(fileName);
        }
    });
} else {
    compileAllFiles();
}

function compileAllFiles() {
    const files = fsExtra.readdirSync(inputFolder);
    const inputFiles = files
        .filter(file => extname(file) === ".scss" && !basename(file).startsWith("_"))
        .map(fileName => join(inputFolder, fileName));

    for (const inputFile of inputFiles) {
        compileFile(inputFile);
    }
    console.info("[sass-compile] Finished compiling all input .scss files.");
}

/**
 * @param {string} inputFile
 */
function compileFile(inputFile) {
    if (args.output === undefined) {
        throw new Error(`[sass-compile] Output folder must be specified with --output CLI argument.`);
    }

    const outFile = join(args.output, `${parsePath(inputFile).name}.css`);
    const outputMapFile = `${outFile}.map`;
    // use deprecated `renderSync` because it supports legacy importers and functions
    const result = sass.renderSync({
        file: inputFile,
        importer: nodeSassPackageImporter(),
        sourceMap: true,
        sourceMapContents: true,
        outFile,
        functions,
        charset: true,
    });
    fsExtra.outputFileSync(outFile, result.css, { flag: "w" });
    if (result.map != null) {
        fsExtra.outputFileSync(
            outputMapFile,
            fixSourcePathsInSourceMap({ outputMapFile, sourceMapBuffer: result.map }),
            {
                flag: "w",
            },
        );
    }
}

/**
 *
 * @param {{ outputMapFile: string, sourceMapBuffer: Buffer }} param0
 * @returns {string}
 */
function fixSourcePathsInSourceMap({ outputMapFile, sourceMapBuffer }) {
    /** @type {import("source-map").RawSourceMap} */
    const parsedMap = JSON.parse(sourceMapBuffer.toString());
    parsedMap.sources = parsedMap.sources.map(source => {
        const outputDirectory = dirname(outputMapFile);
        const pathToSourceWithoutProtocol = source.replace("file://", "");
        return relative(outputDirectory, pathToSourceWithoutProtocol);
    });
    return JSON.stringify(parsedMap);
}
