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

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { createCliLogger } from "./cliLogger.mjs";
import {
    getIconNamesInDirectory,
    ICON_SIZES_PX,
    iconDirectoryParityDiff,
    iconResourcesDir,
    readIconsManifestFile,
    repoRelative,
} from "./common.mjs";
import { canonicalIconName, ICON_NAME_PATTERN } from "./iconNaming.mjs";
import { optimizeSvg } from "./iconSvgoConfig.mjs";

const ICONS_JSON_PATH = resolve(import.meta.dirname, "../icons.json");
const logger = createCliLogger("icons:verify");

/**
 * @typedef {import("./common.mjs").IconMetadata} IconMetadata
 */

/**
 * @returns {Promise<string[]>}
 */
export async function verifyIcons() {
    /** @type {string[]} */
    const errors = [];

    const icons16Dir = join(iconResourcesDir, "16px");
    const icons20Dir = join(iconResourcesDir, "20px");
    const iconNames16 = getIconNamesInDirectory(icons16Dir);
    const iconNames20 = getIconNamesInDirectory(icons20Dir);
    const manifest = readIconsManifestFile(ICONS_JSON_PATH);
    const manifestNames = manifest.map(icon => icon.iconName);

    errors.push(...verifyDirectoryParity(iconNames16, iconNames20));
    errors.push(...verifyIconResourceBasenamesKebab(iconNames16, iconNames20));
    errors.push(...verifyManifestShape(manifest));
    errors.push(...verifyManifestIconNameKebab(manifest));
    errors.push(...verifyManifestMetadataFilled(manifest));
    errors.push(...verifyManifestUniqueness(manifest));
    errors.push(...verifyCodepointSequence(manifest));
    errors.push(...verifyManifestResourceParity(new Set(manifestNames), iconNames16, iconNames20));

    // Only paired icons have both files on disk; unpaired names are already reported by verifyDirectoryParity.
    const pairedIconNames = new Set([...iconNames16].filter(name => iconNames20.has(name)));
    errors.push(...(await verifySvgFormatting(pairedIconNames)));

    return errors;
}

/**
 * @param {Set<string>} iconNames16
 * @param {Set<string>} iconNames20
 */
export function verifyIconResourceBasenamesKebab(iconNames16, iconNames20) {
    /** @type {string[]} */
    const errors = [];
    for (const name of [...new Set([...iconNames16, ...iconNames20])].sort()) {
        if (!ICON_NAME_PATTERN.test(name) || name !== canonicalIconName(name)) {
            errors.push(
                `resources/icons SVG basename "${name}" must be lowercase kebab-case (rename files; keep 16px/20px names in sync)`,
            );
        }
    }
    return errors;
}

/**
 * @param {IconMetadata[]} manifest
 */
export function verifyManifestIconNameKebab(manifest) {
    /** @type {string[]} */
    const errors = [];
    for (const entry of manifest) {
        const label = `icons.json icon "${entry.iconName}"`;
        if (!ICON_NAME_PATTERN.test(entry.iconName) || entry.iconName !== canonicalIconName(entry.iconName)) {
            errors.push(`${label} must be lowercase kebab-case (match SVG basename)`);
        }
    }
    return errors;
}

export function verifyDirectoryParity(iconNames16, iconNames20) {
    const { onlyIn16, onlyIn20 } = iconDirectoryParityDiff(iconNames16, iconNames20);
    return [
        ...onlyIn16.map(name => `resources/icons/16px/${name}.svg is missing matching 20px SVG`),
        ...onlyIn20.map(name => `resources/icons/20px/${name}.svg is missing matching 16px SVG`),
    ];
}

/**
 * @param {IconMetadata[]} manifest
 */
export function verifyManifestShape(manifest) {
    /** @type {string[]} */
    const errors = [];
    manifest.forEach((entry, index) => {
        if (entry == null || typeof entry !== "object" || Array.isArray(entry)) {
            const kind = entry === null ? "null" : Array.isArray(entry) ? "array" : typeof entry;
            errors.push(`icons.json[${index}] must be an object entry (got ${kind})`);
            return;
        }
        if (typeof entry.displayName !== "string") {
            errors.push(`icons.json[${index}] missing string "displayName"`);
        }
        if (typeof entry.iconName !== "string") {
            errors.push(`icons.json[${index}] missing string "iconName"`);
        }
        if (typeof entry.tags !== "string") {
            errors.push(`icons.json[${index}] missing string "tags"`);
        }
        if (typeof entry.group !== "string") {
            errors.push(`icons.json[${index}] missing string "group"`);
        }
        if (!Number.isInteger(entry.codepoint)) {
            errors.push(`icons.json[${index}] has non-integer "codepoint"`);
        }
    });
    return errors;
}

/**
 * @param {IconMetadata[]} manifest
 */
export function verifyManifestMetadataFilled(manifest) {
    /** @type {string[]} */
    const errors = [];
    manifest.forEach(entry => {
        const label = `icons.json icon "${entry.iconName}"`;
        if (typeof entry.tags === "string" && entry.tags.trim().length === 0) {
            errors.push(`${label} must have non-empty "tags"`);
        }
        if (typeof entry.group === "string" && entry.group.trim().length === 0) {
            errors.push(`${label} must have non-empty "group"`);
        }
    });
    return errors;
}

/**
 * @param {IconMetadata[]} manifest
 */
export function verifyManifestUniqueness(manifest) {
    /** @type {string[]} */
    const errors = [];
    const iconNames = new Set();
    const codepoints = new Set();
    for (const entry of manifest) {
        if (iconNames.has(entry.iconName)) {
            errors.push(`icons.json has duplicate iconName "${entry.iconName}"`);
        }
        if (codepoints.has(entry.codepoint)) {
            errors.push(`icons.json has duplicate codepoint ${entry.codepoint}`);
        }
        iconNames.add(entry.iconName);
        codepoints.add(entry.codepoint);
    }
    return errors;
}

/**
 * @param {IconMetadata[]} manifest
 */
export function verifyCodepointSequence(manifest) {
    if (manifest.length === 0) {
        return [];
    }
    const sorted = manifest.map(entry => entry.codepoint).sort((a, b) => a - b);
    /** @type {string[]} */
    const errors = [];
    for (let i = 1; i < sorted.length; i++) {
        const expected = sorted[i - 1] + 1;
        if (sorted[i] !== expected) {
            errors.push(`icons.json codepoints must be sequential; expected ${expected} but found ${sorted[i]}`);
            break;
        }
    }
    return errors;
}

/**
 * @param {Set<string>} manifestNames
 * @param {Set<string>} iconNames16
 * @param {Set<string>} iconNames20
 */
export function verifyManifestResourceParity(manifestNames, iconNames16, iconNames20) {
    /** @type {string[]} */
    const errors = [];
    for (const iconName of manifestNames) {
        if (!iconNames16.has(iconName)) {
            errors.push(`icons.json icon "${iconName}" is missing resources/icons/16px/${iconName}.svg`);
        }
        if (!iconNames20.has(iconName)) {
            errors.push(`icons.json icon "${iconName}" is missing resources/icons/20px/${iconName}.svg`);
        }
    }
    for (const iconName of iconNames16) {
        if (!manifestNames.has(iconName)) {
            errors.push(`resources/icons contains unmanifested icon "${iconName}"`);
        }
    }
    return errors;
}

/**
 * @param {Set<string>} iconNames
 */
async function verifySvgFormatting(iconNames) {
    /** @type {string[]} */
    const errors = [];
    for (const iconName of [...iconNames].sort()) {
        for (const size of ICON_SIZES_PX) {
            const path = join(iconResourcesDir, size, `${iconName}.svg`);
            const source = readFileSync(path, "utf8");
            const optimized = optimizeSvg(source, path);
            if (optimized !== source) {
                const displayPath = repoRelative(path);
                errors.push(
                    `${displayPath} is not normalized; run "pnpm --filter @blueprintjs/icons icons:add" or reformat icon resources`,
                );
            }
        }
    }
    return errors;
}

async function main() {
    logger.header("Validating icon resources and manifest");
    const errors = await verifyIcons();
    if (errors.length === 0) {
        logger.success("Icon resources and manifest are valid.");
        return;
    }

    logger.error(`Found ${errors.length} icon validation failure(s).`);
    for (const error of errors) {
        logger.item(error);
    }
    process.exitCode = 1;
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main();
}
