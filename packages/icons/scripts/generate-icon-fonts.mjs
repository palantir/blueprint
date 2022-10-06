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
 * @fileoverview Generates icon fonts and codepoints from SVG sources
 */

// @ts-check

import { FontAssetType, OtherAssetType, generateFonts as runFantasticon } from "fantasticon";
import { getLogger } from "fantasticon/lib/cli/logger.js";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

import { generatedSrcDir, iconResourcesDir, iconsMetadata, NS, scriptsDir } from "./common.mjs";

const logger = getLogger();

/** @type {import("fantasticon/lib/utils/codepoints").CodepointsMap} */
const codepoints = {};

for (const icon of iconsMetadata) {
    if (Object.values(codepoints).indexOf(icon.codepoint) !== -1) {
        throw new Error(
            `[generate-icon-fonts] Invalid metadata entry in icons.json: icon "${icon.iconName}" cannot have codepoint ${icon.codepoint}, it is already in use.`,
        );
    }
    codepoints[icon.iconName] = icon.codepoint;
}

logger.start();
await Promise.all([
    connectToLogger(generateFonts(16, `${NS}-icon-standard`)),
    connectToLogger(generateFonts(20, `${NS}-icon-large`)),
]);

/**
 * @param {number} size
 * @param {string} prefix
 */
async function generateFonts(size, prefix) {
    mkdirSync(join(generatedSrcDir, `${size}px/paths`), { recursive: true });
    return runFantasticon({
        name: `blueprint-icons-${size}`,
        inputDir: join(iconResourcesDir, `${size}px`),
        outputDir: join(generatedSrcDir, `${size}px`),
        normalize: true,
        descent: 0,
        // N.B. Important: we need to scale up the font height so that the icons do not get visually degraded
        // or compressed through rounding errors (svgicons2svgfont rasterizes the icons in order to convert them)
        // See https://github.com/palantir/blueprint/issues/5002
        fontHeight: size * 20,
        fontTypes: [FontAssetType.TTF, FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF],
        // CSS contains @font-face, SCSS contains codepoints, TS contains enums & codepoints
        assetTypes: [OtherAssetType.CSS, OtherAssetType.SCSS, OtherAssetType.TS],
        templates: {
            // N.B. in icons-20, we don't generate CSS or the codepoints since we expect them to be the same as icons-16
            scss: resolve(scriptsDir, `./icons-${size}.scss.hbs`),
            css: resolve(scriptsDir, "./icons.css.hbs"),
        },
        pathOptions: {
            scss: join(generatedSrcDir, `${size}px`, "_icon-variables.scss"),
        },
        codepoints,
        tag: "i",
        prefix,
    });
}

/**
 * @param {Promise<import("fantasticon/lib/core/runner").RunnerResults>} runner
 * @returns {Promise<void>}
 */
function connectToLogger(runner) {
    return runner.then(results => logger.results(results)).catch(error => logger.error(error));
}
