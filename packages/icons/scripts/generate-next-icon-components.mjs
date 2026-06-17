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
import { optimizeSvg } from "./iconSvgoConfig.mjs";

const outlinedResourcesDir = join(iconResourcesDir, "next/outlined");
const filledResourcesDir = join(iconResourcesDir, "next/filled");
const generatedNextDir = resolve(import.meta.dirname, "../src/next/generated");
const generatedNextComponentsDir = join(generatedNextDir, "components");
const iconsNextManifestPath = resolve(import.meta.dirname, "../icons-next.json");

/**
 * @typedef {Object} IconsNextManifestEntry
 * @property {string} name
 * @property {boolean} hasFilled
 * @property {string[]} tags
 */

/**
 * @param {IconsNextManifestEntry[]} manifest
 * @param {Set<string>} outlinedIconNameSet
 * @param {Set<string>} filledIconNameSet
 * @returns {IconsNextManifestEntry[]}
 */
function validateIconsNextManifest(manifest, outlinedIconNameSet, filledIconNameSet) {
    const manifestNames = new Set();
    /** @type {string[]} */
    const errors = [];

    for (const [index, entry] of manifest.entries()) {
        const label = `icons-next.json[${index}]`;
        if (entry == null || typeof entry !== "object") {
            errors.push(`${label} must be an object`);
            continue;
        }
        if (typeof entry.name !== "string") {
            errors.push(`${label} missing string "name"`);
        }
        if (typeof entry.hasFilled !== "boolean") {
            errors.push(`${label} missing boolean "hasFilled"`);
        }
        if (!Array.isArray(entry.tags) || !entry.tags.every(tag => typeof tag === "string")) {
            errors.push(`${label} "tags" must be an array of strings`);
        }
        if (typeof entry.name === "string") {
            if (manifestNames.has(entry.name)) {
                errors.push(`icons-next.json has duplicate name "${entry.name}"`);
            }
            manifestNames.add(entry.name);

            const hasFilledOnDisk = filledIconNameSet.has(entry.name);
            if (entry.hasFilled !== hasFilledOnDisk) {
                errors.push(
                    `icons-next.json icon "${entry.name}" has hasFilled=${entry.hasFilled} but filled SVG ${
                        hasFilledOnDisk ? "exists" : "is missing"
                    }`,
                );
            }
        }
    }

    for (const iconName of outlinedIconNameSet) {
        if (!manifestNames.has(iconName)) {
            errors.push(`resources/icons/next/outlined/${iconName}.svg has no entry in icons-next.json`);
        }
    }

    for (const name of manifestNames) {
        if (!outlinedIconNameSet.has(name)) {
            errors.push(`icons-next.json icon "${name}" is missing resources/icons/next/outlined/${name}.svg`);
        }
    }

    if (errors.length > 0) {
        throw new Error(`icons-next.json validation failed:\n${errors.map(e => `  - ${e}`).join("\n")}`);
    }

    return manifest;
}

/**
 * @param {"outlined" | "filled"} variant
 * @param {string} iconName
 * @returns {string[]}
 */
function extractPathsFromNextResourceSvg(variant, iconName) {
    const path = join(iconResourcesDir, "next", variant, `${iconName}.svg`);
    const source = readFileSync(path, "utf8");
    const optimized = optimizeSvg(source, path);
    const paths = [];
    const re = /<path[^>]*\sd="([^"]+)"/g;
    let m;
    while ((m = re.exec(optimized)) !== null) {
        paths.push(m[1]);
    }
    return paths;
}

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
mkdirSync(generatedNextComponentsDir, { recursive: true });

const outlinedIconNames = [...getIconNamesInDirectory(outlinedResourcesDir)].sort();
const filledIconNames = [...getIconNamesInDirectory(filledResourcesDir)].sort();
const outlinedIconNameSet = new Set(outlinedIconNames);
const filledIconNameSet = new Set(filledIconNames);

const missingOutlined = filledIconNames.filter(name => !outlinedIconNameSet.has(name));
if (missingOutlined.length > 0) {
    throw new Error(
        `Filled icon SVGs must have outlined counterparts. Missing outlined files: ${missingOutlined.join(", ")}`,
    );
}

console.info(
    `Generating next icon components (${outlinedIconNames.length} outlined, ${filledIconNames.length} filled)...`,
);
/** @type {string[]} */
const componentIndexLines = [];

for (const iconName of outlinedIconNames) {
    const outlinedPaths = extractPathsFromNextResourceSvg("outlined", iconName);

    // Generate component module (outlined)
    writeFileSync(
        join(generatedNextComponentsDir, `${iconName}.tsx`),
        generateNextComponentSource(iconName, "outlined", outlinedPaths),
    );
    componentIndexLines.push(`export { ${pascalCase(iconName)}Icon } from "./${iconName}";`);

    if (filledIconNameSet.has(iconName)) {
        const filledPaths = extractPathsFromNextResourceSvg("filled", iconName);

        // Generate component module (filled)
        writeFileSync(
            join(generatedNextComponentsDir, `${iconName}-filled.tsx`),
            generateNextComponentSource(iconName, "filled", filledPaths),
        );
        componentIndexLines.push(`export { ${pascalCase(iconName)}FilledIcon } from "./${iconName}-filled";`);
    }
}

writeFileSync(join(generatedNextComponentsDir, "index.ts"), `${componentIndexLines.join("\n")}\n`);

writeFileSync(
    join(generatedNextDir, "index.ts"),
    [
        `export * from "../../index";`,
        `export * from "./components";`,
        `export { nextIconManifest, type NextIconName, type NextIconManifestEntry } from "./manifest";`,
        `export { SvgIconContainerNext, type SvgIconContainerNextComponent, type SvgIconContainerNextProps } from "../svgIconContainerNext";`,
        "",
    ].join("\n"),
);

/** @type {IconsNextManifestEntry[]} */
const iconsNextManifestFromDisk = readIconsManifestFile(iconsNextManifestPath);
const iconsNextManifest = validateIconsNextManifest(iconsNextManifestFromDisk, outlinedIconNameSet, filledIconNameSet);

writeFileSync(
    join(generatedNextDir, "manifest.ts"),
    [
        "/*",
        " * Copyright 2026 Palantir Technologies, Inc. All rights reserved.",
        ' * Licensed under the Apache License, Version 2.0 (the "License");',
        " */",
        "",
        "export interface NextIconManifestEntry {",
        "    name: string;",
        "    tags: readonly string[];",
        "    hasFilled: boolean;",
        "}",
        "",
        'export type NextIconName = NextIconManifestEntry["name"];',
        "",
        `export const nextIconManifest = ${JSON.stringify(iconsNextManifest, null, 4)} as const satisfies readonly NextIconManifestEntry[];`,
        "",
    ].join("\n"),
);

console.info(`Read ${repoRelative(iconsNextManifestPath)}`);
console.info(`Wrote ${repoRelative(join(repoRoot, "packages/icons/src/next/generated"))}`);
