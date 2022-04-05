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

const { generateFonts: runFantasticon, FontAssetType, OtherAssetType } = require("fantasticon");
const { getLogger } = require("fantasticon/lib/cli/logger");
const fs = require("fs");
const path = require("path");

const iconsMetadata = require("../icons.json");
const { RESOURCES_DIR, GENERATED_SRC_DIR, NS } = require("./common");

const logger = getLogger();
const codepoints = {};

(async function () {
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
})();

async function generateFonts(size, prefix) {
    fs.mkdirSync(path.join(GENERATED_SRC_DIR, `${size}px/paths`), { recursive: true });
    return runFantasticon({
        name: `blueprint-icons-${size}`,
        inputDir: path.join(RESOURCES_DIR, `${size}px`),
        outputDir: path.join(GENERATED_SRC_DIR, `${size}px`),
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
            scss: path.resolve(__dirname, `./icons-${size}.scss.hbs`),
            css: path.resolve(__dirname, "./icons.css.hbs"),
        },
        pathOptions: {
            scss: path.join(GENERATED_SRC_DIR, `${size}px`, "_icon-variables.scss"),
        },
        codepoints,
        tag: "i",
        prefix,
    });
}

function connectToLogger(runner) {
    return runner.then(results => logger.results(results)).catch(error => logger.error(error));
}
