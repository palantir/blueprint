/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { generatedSrcDir, getIconNamesInDirectory, iconResourcesDir, repoRelative } from "./common.mjs";
import { validateIconNameMap } from "./iconNameMapValidation.mjs";

const iconNameMapPath = resolve(import.meta.dirname, "../icons-name-map.json");
const generatedIconNameMapPath = join(generatedSrcDir, "iconNameMap.ts");

const legacyIconNames = getIconNamesInDirectory(join(iconResourcesDir, "16px"));
const nextIconNames = getIconNamesInDirectory(join(iconResourcesDir, "next/outlined"));

const rawMap = readFileSync(iconNameMapPath, "utf8");
/** @type {Record<string, string>} */
const iconNameMap = JSON.parse(rawMap);

const errors = validateIconNameMap(rawMap, iconNameMap, legacyIconNames, nextIconNames);
if (errors.length > 0) {
    throw new Error(`icons-name-map.json validation failed:\n${errors.map(e => `  - ${e}`).join("\n")}`);
}

console.info(`Generating legacy→next icon name map (${Object.keys(iconNameMap).length} entries)...`);

const entries = Object.keys(iconNameMap)
    .sort()
    .map(name => `    ${JSON.stringify(name)}: ${JSON.stringify(iconNameMap[name])},`);

mkdirSync(generatedSrcDir, { recursive: true });
writeFileSync(
    generatedIconNameMapPath,
    [
        "/*",
        " * Copyright 2026 Palantir Technologies, Inc. All rights reserved.",
        ' * Licensed under the Apache License, Version 2.0 (the "License");',
        " */",
        "",
        'import type { IconName } from "../iconNames";',
        'import type { IconNextName } from "../next/iconNextNames";',
        "",
        "/**",
        ' * Maps legacy ("current") Blueprint icon names to their next-generation',
        " * (`@blueprintjs/icons/next`) equivalents. Generated from `icons-name-map.json`.",
        " */",
        "export const LegacyToIconNextNameMap: Record<IconName, IconNextName> = {",
        ...entries,
        "};",
        "",
    ].join("\n"),
);

console.info(`Read ${repoRelative(iconNameMapPath)}`);
console.info(`Wrote ${repoRelative(generatedIconNameMapPath)}`);
