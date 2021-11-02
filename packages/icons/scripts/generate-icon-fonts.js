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
const svgFixer = require("oslllo-svg-fixer");

const { BUILD_DIR, RESOURCES_DIR, GENERATED_SRC_DIR, NS } = require("./common");

const logger = getLogger();

(async function() {
    logger.start();
    await fixSVGs(16);
    await fixSVGs(20);
    await Promise.all([
        connectToLogger(generateFonts(16, `${NS}-icon-standard`)),
        connectToLogger(generateFonts(20, `${NS}-icon-large`)),
    ]);
})();

async function fixSVGs(size) {
    console.info(`Tranforming ${size}px icon SVGs into an icon-font-ready representation...`);
    const resourcesDir = path.join(RESOURCES_DIR, `${size}px`);
    const buildDir = path.join(BUILD_DIR, `${size}px`);
    fs.mkdirSync(buildDir, { recursive: true });
    return svgFixer(resourcesDir, buildDir, { showProgressBar: true }).fix();
}

async function generateFonts(size, prefix) {
    fs.mkdirSync(path.join(GENERATED_SRC_DIR, `${size}px/paths`), { recursive: true });
    return runFantasticon({
        name: `blueprint-icons-${size}`,
        inputDir: path.join(BUILD_DIR, `${size}px`),
        outputDir: path.join(GENERATED_SRC_DIR, `${size}px`),
        fontHeight: size,
        fontTypes: [FontAssetType.TTF, FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF, FontAssetType.SVG],
        // CSS contains @font-face, SCSS contains codepoints, TS contains enums & codepoints
        assetTypes: [OtherAssetType.CSS, OtherAssetType.SCSS, OtherAssetType.TS],
        templates: {
            // N.B. here we don't generate CSS, or even the code points (we expect them to be the same as icons-16)
            scss: path.resolve(__dirname, `./icons-${size}.scss.hbs`),
            css: path.resolve(__dirname, "./icons.css.hbs"),
        },
        pathOptions: {
            scss: path.join(GENERATED_SRC_DIR, `${size}px`, "_icon-variables.scss"),
        },
        tag: "i",
        prefix,
    });
}

function connectToLogger(runner) {
    return runner
        .then(results => logger.results(results))
        .catch(error => logger.error(error));
}
