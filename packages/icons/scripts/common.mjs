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

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";
import iconsMetadataJson from "../icons.json" with { type: "json" };

/** Monorepo root (directory containing `packages/`). */
export const repoRoot = resolve(import.meta.dirname, "../../..");

export const iconResourcesDir = resolve(import.meta.dirname, "../../../resources/icons");

/**
 * Basenames (no extension) of `.svg` files in a directory.
 *
 * @param {string} dir
 * @returns {Set<string>}
 */
export function getIconNamesInDirectory(dir) {
    return new Set(
        readdirSync(dir)
            .filter(filename => extname(filename) === ".svg")
            .map(filename => basename(filename, ".svg")),
    );
}

/**
 * SVG basenames that appear in only one of the `resources/icons/16px` vs `20px` trees.
 *
 * @param {Set<string>} iconNames16
 * @param {Set<string>} iconNames20
 * @returns {{ onlyIn16: string[]; onlyIn20: string[] }}
 */
export function iconDirectoryParityDiff(iconNames16, iconNames20) {
    const onlyIn16 = [...iconNames16].filter(name => !iconNames20.has(name)).sort();
    const onlyIn20 = [...iconNames20].filter(name => !iconNames16.has(name)).sort();
    return { onlyIn16, onlyIn20 };
}

/**
 * @param {string} absolutePath
 * @returns {string} path relative to {@link repoRoot} for stable CLI output
 */
export function repoRelative(absolutePath) {
    return relative(repoRoot, absolutePath);
}

export const generatedSrcDir = resolve(import.meta.dirname, "../src/generated");
export const generatedComponentsDir = join(generatedSrcDir, "components");
export const NS = "bp6";
/** @type { [16, 20] } */
export const ICON_SIZES = [16, 20];
export const ICON_SIZES_PX = ICON_SIZES.map(n => `${n}px`);

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

/**
 * Read `icons.json` from disk and ensure the root value is a JSON array.
 *
 * @param {string} jsonPath absolute path
 * @returns {IconMetadata[]}
 */
export function readIconsManifestFile(jsonPath) {
    const label = repoRelative(jsonPath);
    let parsed;
    try {
        parsed = JSON.parse(readFileSync(jsonPath, "utf8"));
    } catch (err) {
        if (err instanceof SyntaxError) {
            throw new Error(`${label} is not valid JSON (${err.message})`);
        }
        throw err;
    }
    if (!Array.isArray(parsed)) {
        const kind = parsed === null ? "null" : typeof parsed;
        throw new Error(`${label} must be a JSON array of icon entries; got ${kind}`);
    }
    return parsed;
}

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
