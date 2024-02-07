/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import fs from "fs-extra";
import { dirname, join, parse as parsePath, relative } from "node:path";
import * as sass from "sass";
import { SourceMapConsumer, SourceMapGenerator } from "source-map-js";

import blueprintMonorepoImporter from "./sassBlueprintMonorepoImporter.mjs";
import defaultCustomFunctions from "./sassCustomFunctions.mjs";

/**
 * @param {string} inputFilePath
 * @param {string} outputDir
 * @param {Record<string, sass.CustomFunction<"async">> | undefined} customFunctions
 */
export async function sassCompileFile(inputFilePath, outputDir, customFunctions) {
    const outputFilepath = join(outputDir, `${parsePath(inputFilePath).name}.css`);
    const result = await sass.compileAsync(inputFilePath, {
        importers: [blueprintMonorepoImporter],
        sourceMap: true,
        functions: {
            ...defaultCustomFunctions,
            // custom functions specified as CLI args are allowed to override our default ones
            ...customFunctions,
        },
        charset: true,
    });
    fs.outputFileSync(outputFilepath, result.css, { flag: "w" });
    if (result.sourceMap != null) {
        const outputSourceMapFilepath = `${outputFilepath}.map`;
        fs.outputFileSync(
            outputSourceMapFilepath,
            fixSourcePathsInSourceMap({ outputMapFile: outputSourceMapFilepath, rawSourceMap: result.sourceMap }),
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
    return SourceMapGenerator.fromSourceMap(new SourceMapConsumer(rawSourceMap)).toString();
}
