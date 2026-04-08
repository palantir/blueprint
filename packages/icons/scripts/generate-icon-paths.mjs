/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generates SVG paths used in <Icon> React components
 *
 * Important: we expect ../src/generated/ to contain SVG definitions of all the icons already before this script runs.
 */

// @ts-check

import { pascalCase, snakeCase } from "change-case";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { svgOptimizer } from "@blueprintjs/node-build-scripts";

import { generatedSrcDir, ICON_SIZES, iconResourcesDir, iconsMetadata, writeLinesToFile } from "./common.mjs";
import { extractPathsFromResourceSvg } from "./extractPathsFromResourceSvg.mjs";
const ICON_NAMES = iconsMetadata.map(icon => icon.iconName);

const ICON_NAME_LITERAL_UNION = ICON_NAMES.map(iconName => `"${iconName}"`).join(" | ");
const ICON_NAME_ENUM_LINES = ICON_NAMES.map(iconName => `    ${snakeCase(iconName).toUpperCase()}: "${iconName}",`);

for (const iconSize of ICON_SIZES) {
    mkdirSync(join(generatedSrcDir, `${iconSize}px`), { recursive: true });
    mkdirSync(join(generatedSrcDir, `${iconSize}px/paths`), { recursive: true });
    const iconPaths = await getIconPaths(iconSize);

    for (const [iconName, pathStrings] of Object.entries(iconPaths)) {
        const serializedPathStrings = pathStrings.map(path => JSON.stringify(path));
        const line =
            serializedPathStrings.length > 0
                ? `export default [${serializedPathStrings.join(", ")}];`
                : // special case for "blank" icon - we need an explicit typedef
                  `const p: string[] = []; export default p;`;

        writeLinesToFile(`${iconSize}px/paths/${iconName}.ts`, line);
    }

    console.info(`Writing index file for ${iconSize}px icon kit paths...`);
    writeLinesToFile(
        `${iconSize}px/paths/index.ts`,
        ...ICON_NAMES.map(iconName => `export { default as ${pascalCase(iconName)} } from "./${iconName}";`),
    );
    console.info("Done.");
}

writeLinesToFile(
    "16px/blueprint-icons-16.ts",
    "/* eslint-disable camelcase */",
    "",
    `export type BlueprintIcons_16Id = ${ICON_NAME_LITERAL_UNION};`,
    "",
    "export const BlueprintIcons_16 = {",
    ...ICON_NAME_ENUM_LINES,
    "} as const satisfies Record<string, BlueprintIcons_16Id>;",
);

/**
 * Loads SVG file for each icon, extracts path strings `d="path-string"`,
 * and constructs map of icon name to array of path strings.
 *
 * @param {16 | 20} iconSize
 */
async function getIconPaths(iconSize) {
    /** @type Record<string, string[]> */
    const iconPaths = {};
    for (const iconName of ICON_NAMES) {
        const filepath = join(iconResourcesDir, `${iconSize}px/${iconName}.svg`);
        const svg = readFileSync(filepath, "utf-8");
        const optimizedSvg = await svgOptimizer.optimize(svg, { path: filepath });
        const pathStrings = extractPathsFromResourceSvg(optimizedSvg.data);
        iconPaths[iconName] = pathStrings;
    }
    console.info(`Parsed ${Object.keys(iconPaths).length} ${iconSize}px icons.`);
    return iconPaths;
}
