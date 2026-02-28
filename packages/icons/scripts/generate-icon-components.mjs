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
 * @fileoverview Generates SVG React components for each icon by reading path data
 * directly from the source SVG files in resources/icons/16px/.
 */

// @ts-check

import { pascalCase } from "change-case";
import Handlebars from "handlebars";
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "svg-parser";

import { generatedComponentsDir, generatedSrcDir, iconResourcesDir } from "./common.mjs";

Handlebars.registerHelper("pascalCase", iconName => pascalCase(iconName));

const iconComponentTemplate = Handlebars.compile(
    readFileSync(resolve(import.meta.dirname, "iconComponent.tsx.hbs"), "utf8"),
);
const componentsIndexTemplate = Handlebars.compile(
    readFileSync(resolve(import.meta.dirname, "componentsIndex.ts.hbs"), "utf8"),
);
const indexTemplate = Handlebars.compile(readFileSync(resolve(import.meta.dirname, "index.ts.hbs"), "utf8"));

/** @type {{[iconName: string]: string[]}} */
const iconPaths = {};

// parse icon paths directly from source SVG files
const sourceDir = join(iconResourcesDir, "16px");
const svgFiles = readdirSync(sourceDir).filter(f => f.endsWith(".svg")).sort();

console.info(`Reading icon paths from ${svgFiles.length} source SVGs in resources/icons/16px/...`);
for (const svgFile of svgFiles) {
    const iconName = svgFile.replace(".svg", "");
    const svgContent = readFileSync(join(sourceDir, svgFile), "utf8");
    const pathData = extractPathData(svgContent);
    if (pathData.length === 0) {
        console.warn(`No <path> elements found in ${svgFile}, skipping!`);
        continue;
    }
    iconPaths[iconName] = pathData;
}
console.info(`Parsed ${Object.keys(iconPaths).length} icons.`);

// clear existing icon components
console.info("Clearing existing icon modules...");
rmSync(generatedComponentsDir, { recursive: true, force: true });

// generate an ES module for each icon
console.info("Generating ES modules for each icon...");
mkdirSync(generatedComponentsDir, { recursive: true });

for (const [iconName, iconPathsArray] of Object.entries(iconPaths)) {
    writeFileSync(
        join(generatedComponentsDir, `${iconName}.tsx`),
        iconComponentTemplate({
            iconName,
            iconPaths: iconPathsArray,
        }),
    );
}

const iconNames = Object.keys(iconPaths);

console.info(`Writing index file for all icon modules...`);
writeFileSync(
    join(generatedComponentsDir, "index.ts"),
    componentsIndexTemplate({ iconNames }),
);

console.info(`Writing index file for package...`);
writeFileSync(
    join(generatedSrcDir, "index.ts"),
    indexTemplate({ iconNames }),
);

console.info("Done.");

/**
 * Extract all path `d` attribute values from a source SVG file.
 *
 * @param {string} svgContent
 * @returns {string[]} array of path data strings
 */
function extractPathData(svgContent) {
    const rootNode = parse(svgContent);
    /** @type {string[]} */
    const paths = [];

    // @ts-ignore - svg-parser Node union type doesn't narrow well, but we only visit ElementNodes here
    function visit(node) {
        if (node.tagName === "path" && node.properties?.d) {
            paths.push(/** @type {string} */ (node.properties.d));
        }
        if (node.children) {
            for (const child of node.children) {
                if (typeof child !== "string") {
                    visit(child);
                }
            }
        }
    }

    for (const child of rootNode.children) {
        if (typeof child !== "string") {
            visit(child);
        }
    }

    return paths;
}
