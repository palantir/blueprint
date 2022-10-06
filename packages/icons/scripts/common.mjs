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

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const scriptsDir = fileURLToPath(new URL(".", import.meta.url));
export const iconResourcesDir = resolve(scriptsDir, "../../../resources/icons");
export const generatedSrcDir = resolve(scriptsDir, "../src/generated");
export const NS = "bp4";

/**
 * @typedef {Object} IconMetadata
 * @property {string} displayName - "Icon name" for display
 * @property {string} iconName - `icon-name` for IconName and CSS class
 * @property {string} tags - comma separated list of tags describing this icon
 * @property {string} group - group to which this icon belongs
 * @property {string} content - unicode character for icon glyph in font
 * @property {number} codepoint - icon font codepoint
 */

// TODO(adahiya): replace this with `await import("../icons.json", { assert: { type: "json" } })` in Node 17.5+
/** @type {IconMetadata[]} */
export const iconsMetadata = JSON.parse(readFileSync(resolve(scriptsDir, "../icons.json"), { encoding: "utf8" })).sort(
    (a, b) => a.iconName.localeCompare(b.iconName),
);

/**
 * Writes lines to given filename in GENERATED_SRC_DIR.
 *
 * @param {string} filename
 * @param {Array<string>} lines
 */
export function writeLinesToFile(filename, ...lines) {
    const outputPath = join(generatedSrcDir, filename);
    const contents = [...lines, ""].join("\n");
    writeFileSync(outputPath, contents);
}
