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

const fs = require("fs");
const path = require("path");
const webfont = require("webfont").default;

const { BUILD_DIR, GENERATED_SRC_DIR, NS } = require("./common");
const WEBFONT_FORMATS = ["ttf", "eot", "woff", "woff2"];

(async function() {
    await Promise.all([
        generateFonts(16, `${NS}-icon-standard`),
        generateFonts(20, `${NS}-icon-large`),
        generateSassVariables(),
        generateTypeScript(),
    ]);
    console.info("Done!");
})();

async function generateFonts(size, prefix) {
    const outputDir = path.join(GENERATED_SRC_DIR, `${size}px`);
    fs.mkdirSync(path.join(outputDir, "paths"), { recursive: true });

    console.info(`Generating ${size}px webfont...`);
    const result = await webfont({
        files: path.join(BUILD_DIR, `${size}px`, "*.svg"),
        fontName: `blueprint-icons-${size}`,
        formats: WEBFONT_FORMATS,
        template: path.resolve(__dirname, "../src/templates/font-face-template.css.njk"),
        templateClassName: prefix,
        addHashInFontUrl: true,
    });

    console.info(`Writing ${size}px webfonts and @font-face styles...`);
    fs.writeFileSync(path.join(outputDir, `blueprint-icons-${size}.css`), result.template, { encoding: "utf8" });
    for (const format of WEBFONT_FORMATS) {
        const outputFilepath = path.join(outputDir, `blueprint-icons-${size}.${format}`);
        fs.writeFileSync(outputFilepath, result[format], { encoding: "utf8" });
    }
}

async function generateSassVariables() {
    console.info(`Generating Sass variables...`);
    const result = await webfont({
        files: path.join(BUILD_DIR, "16px", "*.svg"),
        formats: [],
        template: path.resolve(__dirname, "../src/templates/variables-template.scss.njk"),
    });
    fs.writeFileSync(path.join(GENERATED_SRC_DIR, `variables.scss`), result.template, { encoding: "utf8" });
}

async function generateTypeScript() {
    // HACKHACK: need to run webfont() again to write render another template
    console.info("Generating TS types and codepoints...")
    const result = await webfont({
        files: path.join(BUILD_DIR, "16px", "*.svg"),
        formats: [],
        template: path.resolve(__dirname, "../src/templates/blueprint-icons-template.ts.njk"),
    });
    fs.writeFileSync(path.join(GENERATED_SRC_DIR, `blueprint-icons.ts`), result.template, { encoding: "utf8" });
}
