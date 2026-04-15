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
 *
 * Paths are taken from the same resource SVGs as {@link generate-icon-paths.mjs} (used by `<Icon />`).
 * We intentionally do not use glyph paths from the generated icon font: those live in an upscaled coordinate
 * system and require fragile scale/translate transforms (see {@link ICON_RASTER_SCALING_FACTOR} in common.mjs).
 */

// @ts-check

import { pascalCase } from "change-case";
import Handlebars from "handlebars";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { generatedComponentsDir, generatedSrcDir, iconsMetadata } from "./common.mjs";
import { extractPathsFromResourceSvg } from "./extractPathsFromResourceSvg.mjs";

Handlebars.registerHelper("pascalCase", iconName => pascalCase(iconName));

const iconComponentTemplate = Handlebars.compile(
    readFileSync(resolve(import.meta.dirname, "iconComponent.tsx.hbs"), "utf8"),
);
const componentsIndexTemplate = Handlebars.compile(
    readFileSync(resolve(import.meta.dirname, "componentsIndex.ts.hbs"), "utf8"),
);
const indexTemplate = Handlebars.compile(readFileSync(resolve(import.meta.dirname, "index.ts.hbs"), "utf8"));

console.info("Clearing existing icon modules...");
rmSync(generatedComponentsDir, { force: true, recursive: true });

console.info("Generating ES modules for each icon...");
mkdirSync(generatedComponentsDir, { recursive: true });

for (const { iconName } of iconsMetadata) {
    let paths16;
    let paths20;
    try {
        [paths16, paths20] = await Promise.all([
            extractPathsFromResourceSvg(16, iconName),
            extractPathsFromResourceSvg(20, iconName),
        ]);
    } catch (error) {
        throw new Error(`[generate-icon-components] Failed to extract 16px/20px paths for "${iconName}"`, {
            cause: error,
        });
    }
    writeFileSync(
        join(generatedComponentsDir, `${iconName}.tsx`),
        iconComponentTemplate({
            iconName,
            paths16Json: JSON.stringify(paths16),
            paths20Json: JSON.stringify(paths20),
        }),
    );
}

console.info(`Writing index file for all icon modules...`);
writeFileSync(
    join(generatedComponentsDir, "index.ts"),
    componentsIndexTemplate({
        iconNames: iconsMetadata.map(i => i.iconName),
    }),
);

console.info(`Writing index file for package...`);
writeFileSync(
    join(generatedSrcDir, "index.ts"),
    indexTemplate({
        iconNames: iconsMetadata.map(i => i.iconName),
    }),
);

console.info("Done.");
