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

import { pascalCase } from "change-case";
import { readFileSync } from "node:fs";
import { join } from "node:path";
// Note: we had issues with this approach using svgo v2.x, so for now we stick with v1.x
// With v2.x, some shapes within the icon SVGs would not get converted to paths correctly,
// resulting in invalid d="..." attributes rendered by the <Icon> component.
import SVGO from "svgo";

import { iconResourcesDir, iconsMetadata, writeLinesToFile } from "./common.mjs";

const svgo = new SVGO({ plugins: [{ convertShapeToPath: { convertArcs: true } }] });

const ICON_NAMES = iconsMetadata.map(icon => icon.iconName);

/** @type {[16, 20]} */
const ICON_SIZES = [16, 20];

for (const iconSize of ICON_SIZES) {
    const iconPaths = await getIconPaths(iconSize);

    for (const [iconName, pathStrings] of Object.entries(iconPaths)) {
        const line =
            pathStrings.length > 0
                ? `export default [${pathStrings.join(", ")}];`
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
        const filepath = join(iconResourcesDir, `${iconSize}px/${iconName}.svg`);
        const svg = readFileSync(filepath, "utf-8");
        const optimizedSvg = await svgo.optimize(svg, { path: filepath });
        const pathStrings = (optimizedSvg.data.match(/ d="[^"]+"/g) || [])
            // strip off leading 'd="'
            .map(s => s.slice(3))
            // strip out newlines and tabs, but keep other whitespace
            .map(s => s.replace(/[\n\t]/g, ""));
        iconPaths[iconName] = pathStrings;
    }
    console.info(`Parsed ${Object.keys(iconPaths).length} ${iconSize}px icons.`);
    return iconPaths;
}
