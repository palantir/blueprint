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

// @ts-check

import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import iconsMetadataJson from "../icons.json" with { type: "json" };

export const iconResourcesDir = resolve(import.meta.dirname, "../../../resources/icons");
export const generatedSrcDir = resolve(import.meta.dirname, "../src/generated");
export const NS = "bp5";
/** @type { [16, 20] } */
export const ICON_SIZES = [16, 20];

/**
 * We need to scale up the icon paths during conversion so that the icons do not get visually degraded
 * or compressed through rounding errors (svgicons2svgfont rasterizes the icons in order to convert them).
 *
 * After generating the icon font files, we also need to take care to scale the paths _back down_ by this
 * factor in the icon component SVG paths, since we read the upscaled paths from SVG font at that point.
 *
 * @see https://github.com/palantir/blueprint/issues/5002
 */
export const ICON_RASTER_SCALING_FACTOR = 20;

/**
 * @typedef {Object} IconMetadata
 * @property {string} displayName - "Icon name" for display
 * @property {string} iconName - `icon-name` for IconName and CSS class
 * @property {string} tags - comma separated list of tags describing this icon
 * @property {string} group - group to which this icon belongs
 * @property {number} codepoint - icon font codepoint
 */

/** @type {IconMetadata[]} */
export const iconsMetadata = iconsMetadataJson.sort((a, b) => a.iconName.localeCompare(b.iconName));

/**
 * Writes lines to given filename in the generated sources directory.
 *
 * @param {string} filename
 * @param {string[]} lines
 */
export function writeLinesToFile(filename, ...lines) {
    const outputPath = join(generatedSrcDir, filename);
    const contents = [...lines, ""].join("\n");
    writeFileSync(outputPath, contents);
}
