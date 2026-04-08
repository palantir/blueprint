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
 * @fileoverview Generates SVG React components for each icon.
 */

// @ts-check

import { pascalCase } from "change-case";
import Handlebars from "handlebars";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { svgOptimizer } from "@blueprintjs/node-build-scripts";

import { generatedComponentsDir, generatedSrcDir, ICON_SIZES, iconResourcesDir, iconsMetadata } from "./common.mjs";
import { extractPathsFromResourceSvg } from "./extractPathsFromResourceSvg.mjs";

Handlebars.registerHelper("pascalCase", iconName => pascalCase(iconName));

const iconComponentTemplate = Handlebars.compile(
    readFileSync(resolve(import.meta.dirname, "iconComponent.tsx.hbs"), "utf8"),
);
const componentsIndexTemplate = Handlebars.compile(
    readFileSync(resolve(import.meta.dirname, "componentsIndex.ts.hbs"), "utf8"),
);
const indexTemplate = Handlebars.compile(readFileSync(resolve(import.meta.dirname, "index.ts.hbs"), "utf8"));

const ICON_NAMES = iconsMetadata.map(icon => icon.iconName);

/** @type { { 16: {[iconName: string]: string[]}; 20: {[iconName: string]: string[]} } } */
const iconPaths = {
    [ICON_SIZES[0]]: {},
    [ICON_SIZES[1]]: {},
};

// parse icon paths from source SVGs so static components align with path modules and <Icon />
for (const iconSize of ICON_SIZES) {
    console.info(`Parsing ${iconSize}px icon paths from resource SVGs...`);
    for (const iconName of ICON_NAMES) {
        const filepath = join(iconResourcesDir, `${iconSize}px/${iconName}.svg`);
        const svg = readFileSync(filepath, "utf-8");
        const optimizedSvg = await svgOptimizer.optimize(svg, { path: filepath });
        iconPaths[iconSize][iconName] = extractPathsFromResourceSvg(optimizedSvg.data);
    }
    console.info(`Parsed ${ICON_NAMES.length} ${iconSize}px icons.`);
}

// clear existing icon components
console.info("Clearing existing icon modules...");
rmSync(generatedComponentsDir, { force: true, recursive: true });

// generate an ES module for each icon
console.info("Generating ES modules for each icon...");
mkdirSync(generatedComponentsDir, { recursive: true });

for (const [iconName, icon16pxPaths] of Object.entries(iconPaths[16])) {
    const icon20pxPaths = iconPaths[20][iconName];
    if (icon20pxPaths === undefined) {
        console.error(`Could not find corresponding 20px icon path for ${iconName}, skipping!`);
        continue;
    }
    writeFileSync(
        join(generatedComponentsDir, `${iconName}.tsx`),
        iconComponentTemplate({
            icon16pxPaths: icon16pxPaths.map(path => JSON.stringify(path)),
            icon20pxPaths: icon20pxPaths.map(path => JSON.stringify(path)),
            iconName,
        }),
    );
}

console.info(`Writing index file for all icon modules...`);
writeFileSync(
    join(generatedComponentsDir, "index.ts"),
    componentsIndexTemplate({
        iconNames: Object.keys(iconPaths[16]),
    }),
);

console.info(`Writing index file for package...`);
writeFileSync(
    join(generatedSrcDir, "index.ts"),
    indexTemplate({
        iconNames: Object.keys(iconPaths[16]),
    }),
);

console.info("Done.");
