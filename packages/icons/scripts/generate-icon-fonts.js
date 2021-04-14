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

const { generateFonts, FontAssetType, OtherAssetType } = require("fantasticon");
const { getLogger } = require("fantasticon/lib/cli/logger");
const fs = require("fs");
const path = require("path");

const RESOURCES_DIR = path.resolve(__dirname, "../../../resources/icons");
const GENERATED_SRC_DIR = path.resolve(__dirname, "../src/generated");
const logger = getLogger();
const NS = "bp4";

logger.start();

fs.mkdirSync(path.join(GENERATED_SRC_DIR, `16px/paths`), { recursive: true });
generateFonts({
    name: "blueprint-icons-16",
    inputDir: path.join(RESOURCES_DIR, "16px"),
    outputDir: path.join(GENERATED_SRC_DIR, "16px"),
    fontHeight: 16,
    fontTypes: [FontAssetType.TTF, FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF, FontAssetType.SVG],
    // CSS contains @font-face, SCSS contains codepoints, TS contains enums & codepoints
    assetTypes: [OtherAssetType.CSS, OtherAssetType.SCSS, OtherAssetType.TS],
    templates: {
        // N.B. we don't generate CSS, just the map of code points which we can use downstream
        scss: path.resolve(__dirname, "./icons-16.scss.hbs"),
        css: path.resolve(__dirname, "./icons.css.hbs"),
    },
    pathOptions: {
        scss: path.join(GENERATED_SRC_DIR, "16px", "_icon-variables.scss"),
    },
    tag: "i",
    prefix: `${NS}-icon-standard`,
})
    .then(results => {
        logger.results(results);
    })
    .catch(error => {
        logger.error(error);
    });

fs.mkdirSync(path.join(GENERATED_SRC_DIR, `20px/paths`), { recursive: true });
generateFonts({
    name: "blueprint-icons-20",
    inputDir: path.join(RESOURCES_DIR, "20px"),
    outputDir: path.join(GENERATED_SRC_DIR, "20px"),
    fontHeight: 20,
    fontTypes: [FontAssetType.TTF, FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF, FontAssetType.SVG],
    // CSS contains @font-face, SCSS contains codepoints, TS contains enums & codepoints
    assetTypes: [OtherAssetType.CSS, OtherAssetType.SCSS, OtherAssetType.TS],
    templates: {
        // N.B. here we don't generate CSS, or even the code points (we expect them to be the same as icons-16)
        scss: path.resolve(__dirname, "./icons-20.scss.hbs"),
        css: path.resolve(__dirname, "./icons.css.hbs"),
    },
    pathOptions: {
        scss: path.join(GENERATED_SRC_DIR, "20px", "_icon-variables.scss"),
    },
    tag: "i",
    prefix: `${NS}-icon-large`,
})
    .then(results => {
        logger.results(results);
    })
    .catch(error => {
        logger.error(error);
    });
