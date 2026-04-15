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
 * @fileoverview Generates SVG path modules used by {@code <Icon />} React components in core.
 *
 * Paths are extracted from the optimized resource SVGs in {@code resources/icons/}.
 */

// @ts-check

import { pascalCase } from "change-case";

import { ICON_SIZES, iconsMetadata, writeLinesToFile } from "./common.mjs";
import { extractPathsFromResourceSvg } from "./extractPathsFromResourceSvg.mjs";

const ICON_NAMES = iconsMetadata.map(icon => icon.iconName);

for (const iconSize of ICON_SIZES) {
    const iconPaths = await getIconPaths(iconSize);

    for (const [iconName, pathStrings] of Object.entries(iconPaths)) {
        const line =
            pathStrings.length > 0
                ? `export default [${pathStrings.map(p => JSON.stringify(p)).join(", ")}];`
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
        iconPaths[iconName] = await extractPathsFromResourceSvg(iconSize, iconName);
    }
    console.info(`Parsed ${Object.keys(iconPaths).length} ${iconSize}px icons.`);
    return iconPaths;
}
