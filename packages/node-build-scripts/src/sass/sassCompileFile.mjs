/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import fsExtra from "fs-extra";
import { dirname, join, parse as parsePath, relative } from "node:path";
import * as sass from "sass";
import { SourceMapGenerator } from "source-map-js";

import defaultCustomFunctions from "./sassCustomFunctions.mjs";
import { loadPaths } from "./sassNodeModulesLoadPaths.mjs";

/**
 * @param {string} inputFilePath
 * @param {string} outputDir
 * @param {Record<string, sass.CustomFunction<"async">> | undefined} customFunctions
 */
export async function sassCompileFile(inputFilePath, outputDir, customFunctions) {
    const outFile = join(outputDir, `${parsePath(inputFilePath).name}.css`);
    const outputMapFile = `${outFile}.map`;
    const result = await sass.compileAsync(inputFilePath, {
        loadPaths,
        sourceMap: true,
        functions: {
            ...defaultCustomFunctions,
            // custom functions specified as CLI args are allowed to override our default ones
            ...customFunctions,
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
