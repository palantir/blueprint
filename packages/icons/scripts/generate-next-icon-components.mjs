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

import { pascalCase } from "change-case";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { getIconNamesInDirectory, iconResourcesDir, readIconsManifestFile, repoRelative, repoRoot } from "./common.mjs";
import { extractPathsFromSvgFile } from "./extractPathsFromResourceSvg.mjs";
import { validateIconsNextManifest } from "./iconsNextManifestValidation.mjs";

const outlinedResourcesDir = join(iconResourcesDir, "next/outlined");
const filledResourcesDir = join(iconResourcesDir, "next/filled");
const legacyResourcesDir = join(iconResourcesDir, "16px");
const generatedNextDir = resolve(import.meta.dirname, "../src/next/generated");
const generatedNextComponentsDir = join(generatedNextDir, "components");
const generatedNextPathsDir = join(generatedNextDir, "paths");
const iconsNextManifestPath = resolve(import.meta.dirname, "../icons-next.json");
const iconNameMapPath = resolve(import.meta.dirname, "../icons-name-map.json");

/**
 * @typedef {Object} IconsNextManifestEntry
 * @property {string} name
 * @property {boolean} hasFilled
 * @property {string[]} tags
 */

/**
 * @param {string} iconName
 * @param {"outlined" | "filled"} variant
 * @param {string[]} paths
 */
function generateNextComponentSource(iconName, variant, paths) {
    const baseName = pascalCase(iconName);
    const exportName = variant === "outlined" ? `${baseName}Icon` : `${baseName}FilledIcon`;
    const displayName = `Blueprint6.Icon.Next.${exportName}`;
    const iconLabel = variant === "outlined" ? iconName : `${iconName}-filled`;
    const pathsJson = JSON.stringify(paths);
    return `/*
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

import * as React from "react";
import type { SVGIconProps } from "../../../svgIconProps";
import { SvgIconContainerNext } from "../../svgIconContainerNext";

const PATHS = ${pathsJson} as readonly string[];

export const ${exportName}: React.FC<SVGIconProps> = React.forwardRef<any, SVGIconProps>((props, ref) => {
    return (
        <SvgIconContainerNext iconName="${iconLabel}" ref={ref} {...props}>
            {PATHS.map((d, i) => (
                <path key={i} d={d} />
            ))}
        </SvgIconContainerNext>
    );
});
${exportName}.displayName = "${displayName}";
export default ${exportName};
`;
}

console.info("Clearing existing next icon modules...");
rmSync(generatedNextComponentsDir, { force: true, recursive: true });
rmSync(generatedNextPathsDir, { force: true, recursive: true });
mkdirSync(generatedNextComponentsDir, { recursive: true });
mkdirSync(generatedNextPathsDir, { recursive: true });

const outlinedIconNames = [...getIconNamesInDirectory(outlinedResourcesDir)].sort();
const filledIconNames = [...getIconNamesInDirectory(filledResourcesDir)].sort();
const outlinedIconNameSet = new Set(outlinedIconNames);
const filledIconNameSet = new Set(filledIconNames);

console.info(
    `Generating next icon components (${outlinedIconNames.length} outlined, ${filledIconNames.length} filled)...`,
);
/** @type {string[]} */
const componentIndexLines = [];
/** @type {string[]} */
const pathIndexLines = [];

for (const iconName of outlinedIconNames) {
    const outlinedPaths = extractPathsFromSvgFile(join(outlinedResourcesDir, `${iconName}.svg`));

    // Generate component module
    const outlinedFileName = `${iconName}.tsx`;
    writeFileSync(
        join(generatedNextComponentsDir, outlinedFileName),
        generateNextComponentSource(iconName, "outlined", outlinedPaths),
    );
    componentIndexLines.push(`export { ${pascalCase(iconName)}Icon } from "./${iconName}";`);

    // Generate path module (outlined)
    writeFileSync(join(generatedNextPathsDir, `${iconName}.ts`), `export default ${JSON.stringify(outlinedPaths)};\n`);
    pathIndexLines.push(`export { default as ${pascalCase(iconName)} } from "./${iconName}";`);

    if (filledIconNameSet.has(iconName)) {
        const filledPaths = extractPathsFromSvgFile(join(filledResourcesDir, `${iconName}.svg`));

        // Generate component module (filled)
        const filledFileName = `${iconName}-filled.tsx`;
        writeFileSync(
            join(generatedNextComponentsDir, filledFileName),
            generateNextComponentSource(iconName, "filled", filledPaths),
        );
        componentIndexLines.push(`export { ${pascalCase(iconName)}FilledIcon } from "./${iconName}-filled";`);

        // Generate path module (filled)
        writeFileSync(
            join(generatedNextPathsDir, `${iconName}-filled.ts`),
            `export default ${JSON.stringify(filledPaths)};\n`,
        );
        pathIndexLines.push(`export { default as ${pascalCase(iconName)}Filled } from "./${iconName}-filled";`);
    }
}

writeFileSync(join(generatedNextComponentsDir, "index.ts"), `${componentIndexLines.join("\n")}\n`);
writeFileSync(join(generatedNextPathsDir, "index.ts"), `${pathIndexLines.join("\n")}\n`);

// Legacy icon-name aliases: emit one renamed re-export per legacy icon so consumers can migrate from
// `@blueprintjs/icons` to `@blueprintjs/icons/next` by changing only the import path. Every legacy name
// maps to the *outlined* next component (the default style in the new set); see icons-name-map.json.
const rawIconNameMap = readFileSync(iconNameMapPath, "utf8");
/** @type {Record<string, string>} */
const iconNameMap = JSON.parse(rawIconNameMap);
const legacyIconNameSet = getIconNamesInDirectory(legacyResourcesDir);

// Every component name the next barrel already exports, so we can detect legacy aliases that would
// collide with a canonical next icon of a *different* glyph (e.g. legacy `align-left` vs next `align-left`).
const canonicalNextExportNames = new Set([
    ...[...outlinedIconNameSet].map(name => `${pascalCase(name)}Icon`),
    ...[...filledIconNameSet].map(name => `${pascalCase(name)}FilledIcon`),
]);

/** @type {string[]} */
const aliasLines = [];
/** @type {string[]} */
const collisionSkipped = [];
for (const legacyName of [...legacyIconNameSet].sort()) {
    const nextName = iconNameMap[legacyName];
    if (nextName == null) {
        // Coverage (every legacy icon has a mapping) is enforced by validateIconNameMap; skip defensively.
        continue;
    }
    const target = `${pascalCase(nextName)}Icon`;
    const aliasName = `${pascalCase(legacyName)}Icon`;

    // Identity: the next barrel already exports this exact name; the import-path swap already works.
    if (aliasName === target) {
        continue;
    }
    // Collision: the alias name already belongs to a different canonical next icon. Let the next
    // canonical export win; the migration codemod rewrites these legacy names to `target` specially.
    if (canonicalNextExportNames.has(aliasName)) {
        collisionSkipped.push(`${aliasName} (legacy "${legacyName}" → ${target})`);
        continue;
    }
    aliasLines.push(`export { ${target} as ${aliasName} } from "./components";`);
}

writeFileSync(
    join(generatedNextDir, "legacyAliases.ts"),
    [
        "/*",
        " * Copyright 2026 Palantir Technologies, Inc. All rights reserved.",
        ' * Licensed under the Apache License, Version 2.0 (the "License");',
        " */",
        "",
        "// Legacy icon-name aliases for `@blueprintjs/icons/next`: each is a renamed re-export of the",
        "// outlined next-generation component, so consumers can migrate from `@blueprintjs/icons` by",
        "// changing only the import path. Generated from icons-name-map.json.",
        "",
        ...aliasLines,
        "",
    ].join("\n"),
);

console.info(`Generated ${aliasLines.length} legacy icon-name aliases.`);
if (collisionSkipped.length > 0) {
    console.info(
        `Skipped ${collisionSkipped.length} legacy alias(es) that collide with a canonical next icon (next name wins):\n` +
            collisionSkipped.map(entry => `  - ${entry}`).join("\n"),
    );
}

writeFileSync(
    join(generatedNextDir, "index.ts"),
    [
        `export * from "../../index";`,
        `export * from "./components";`,
        `export * from "./legacyAliases";`,
        `export { nextIconManifest, type BlueprintIconsNext, type NextIconManifestEntry } from "./manifest";`,
        `export { IconNextNames, IconNextNamesSet, type IconNextName } from "../iconNextNames";`,
        `export { IconsNext, type NextIconVariant, type NextIconLoaderOptions } from "../iconLoaderNext";`,
        `export { type NextIconPathsLoader } from "../pathsLoader";`,
        `export { SvgIconContainerNext, type SvgIconContainerNextComponent, type SvgIconContainerNextProps } from "../svgIconContainerNext";`,
        "",
    ].join("\n"),
);

/** @type {IconsNextManifestEntry[]} */
const iconsNextManifest = readIconsManifestFile(iconsNextManifestPath);
const manifestErrors = validateIconsNextManifest(iconsNextManifest, outlinedIconNameSet, filledIconNameSet);
if (manifestErrors.length > 0) {
    throw new Error(`icons-next.json validation failed:\n${manifestErrors.map(e => `  - ${e}`).join("\n")}`);
}

// Derive the literal-union members from the manifest itself so the union can never drift from `nextIconManifest`.
const iconNextNameUnion = iconsNextManifest.map(entry => `    | "${entry.name}"`).join("\n");

// Derive the literal-union members from the manifest itself so the union can never drift from `nextIconManifest`.
const nextIconNameUnion = iconsNextManifest.map(entry => `    | "${entry.name}"`).join("\n");

writeFileSync(
    join(generatedNextDir, "manifest.ts"),
    [
        "/*",
        " * Copyright 2026 Palantir Technologies, Inc. All rights reserved.",
        ' * Licensed under the Apache License, Version 2.0 (the "License");',
        " */",
        "",
        "export type BlueprintIconsNext =",
        `${iconNextNameUnion};`,
        "",
        "export interface NextIconManifestEntry {",
        "    name: BlueprintIconsNext;",
        "    tags: readonly string[];",
        "    hasFilled: boolean;",
        "}",
        "",
        `export const nextIconManifest = ${JSON.stringify(iconsNextManifest, null, 4)} as const satisfies readonly NextIconManifestEntry[];`,
        "",
    ].join("\n"),
);

console.info(`Read ${repoRelative(iconsNextManifestPath)}`);
console.info(`Wrote ${repoRelative(join(repoRoot, "packages/icons/src/next/generated"))}`);
