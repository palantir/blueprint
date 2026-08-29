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

import { capitalCase } from "change-case";
import { readFileSync, writeFileSync } from "node:fs";
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
const ICONS_NEXT_JSON_PATH = resolve(import.meta.dirname, "../icons-next.json");

export { ICON_NAME_PATTERN, canonicalIconName } from "./iconNaming.mjs";
const logger = createCliLogger("icons:add");

/**
 * @typedef {import("./common.mjs").IconMetadata} IconMetadata
 */

/**
 * @typedef {Object} AddIconsResult
 * @property {string[]} newIconNames
 * @property {Array<{path: string, iconName: string}>} optimizedFiles
 * @property {IconMetadata[]} addedManifestEntries
 */

/**
 * @returns {Promise<AddIconsResult>}
 */
export async function addIcons() {
    const icons16Dir = join(iconResourcesDir, "16px");
    const icons20Dir = join(iconResourcesDir, "20px");

    logger.header("Scanning icon resources");
    logger.info(`16px: ${repoRelative(icons16Dir)}`);
    logger.info(`20px: ${repoRelative(icons20Dir)}`);
    const iconNames16 = getIconNamesInDirectory(icons16Dir);
    const iconNames20 = getIconNamesInDirectory(icons20Dir);
    const manifest = readIconsManifestFile(ICONS_JSON_PATH);

    const parityIssues = getParityIssues(iconNames16, iconNames20);
    if (parityIssues.length > 0) {
        throw new Error(formatIssues("Icon size parity check failed", parityIssues));
    }

    const pairedIconNames = [...iconNames16].sort();
    const manifestNames = new Set(manifest.map(icon => icon.iconName));

    logger.header("Normalizing paired SVGs (SVGO)");

    /** @type {Array<{path: string, iconName: string}>} */
    const optimizedFiles = [];
    for (const iconName of pairedIconNames) {
        for (const size of ICON_SIZES_PX) {
            const path = join(iconResourcesDir, size, `${iconName}.svg`);
            const source = readFileSync(path, "utf8");
            const optimized = optimizeSvg(source, path);
            if (optimized !== source) {
                writeFileSync(path, optimized);
                optimizedFiles.push({ iconName, path });
            }
        }
    }

    const newIconNames = pairedIconNames.filter(iconName => !manifestNames.has(iconName));

    /** @type {IconMetadata[]} */
    let addedManifestEntries = [];

    if (newIconNames.length > 0) {
        const invalidNames = newIconNames.filter(iconName => !ICON_NAME_PATTERN.test(iconName));
        if (invalidNames.length > 0) {
            throw new Error(
                formatIssues(
                    "Invalid icon file names (use lowercase kebab-case basenames; see icons:verify)",
                    invalidNames.map(name => `"${name}" (canonical: "${canonicalIconName(name)}")`),
                ),
            );
        }

        logger.header("Appending new icons to manifest");
        logger.success(`Found ${newIconNames.length} new icon pair(s) not yet in icons.json.`);
        logger.item(newIconNames.join(", "));

        if (manifest.length === 0) {
            throw new Error(
                formatIssues("Cannot append new icons to an empty icons.json", ["Restore packages/icons/icons.json."]),
            );
        }

        const maxCodepoint = manifest.reduce((acc, icon) => Math.max(acc, icon.codepoint), Number.MIN_SAFE_INTEGER);

        /* eslint-disable sort-keys */
        addedManifestEntries = newIconNames.map((iconName, index) => ({
            displayName: capitalCase(iconName),
            iconName,
            tags: "",
            group: "",
            codepoint: maxCodepoint + index + 1,
        }));
        /* eslint-enable sort-keys */

        const updatedManifest = [...manifest, ...addedManifestEntries];
        writeIconsManifest(ICONS_JSON_PATH, updatedManifest);
    }

    printPostRunSummary({
        addedManifestEntries,
        newIconNames,
        optimizedFiles,
        pairedCount: pairedIconNames.length,
    });

    return { addedManifestEntries, newIconNames, optimizedFiles };
}

/**
 * @typedef {Object} AddNextIconsResult
 * @property {string[]} newIconNames
 * @property {Array<{path: string, iconName: string}>} optimizedFiles
 */

/**
 * Scan `resources/icons/next`, normalize the SVGs, and append an `icons-next.json` entry for each
 * outlined icon that does not have one yet. Mirrors {@link addIcons} for the next-generation set,
 * which has no icon font and therefore no codepoint or group: an entry is just the name, whether a
 * filled variant exists, and search tags.
 *
 * @returns {Promise<AddNextIconsResult>}
 */
export async function addNextIcons() {
    const outlinedDir = join(iconResourcesDir, "next/outlined");
    const filledDir = join(iconResourcesDir, "next/filled");

    logger.header("Scanning next-generation icon resources");
    logger.info(`outlined: ${repoRelative(outlinedDir)}`);
    logger.info(`filled: ${repoRelative(filledDir)}`);
    const outlinedIconNames = getIconNamesInDirectory(outlinedDir);
    const filledIconNames = getIconNamesInDirectory(filledDir);

    logger.header("Normalizing next SVGs (SVGO)");

    /** @type {Array<{path: string, iconName: string}>} */
    const optimizedFiles = [];
    for (const dir of [outlinedDir, filledDir]) {
        for (const iconName of [...getIconNamesInDirectory(dir)].sort()) {
            const path = join(dir, `${iconName}.svg`);
            const source = readFileSync(path, "utf8");
            const optimized = optimizeSvg(source, path);
            if (optimized !== source) {
                writeFileSync(path, optimized);
                optimizedFiles.push({ iconName, path });
            }
        }
    }

    // `readIconsManifestFile` only guarantees "a JSON array"; entry shape is enforced by
    // `validateIconsNextManifest` in icons:verify, so its legacy return type is re-cast here.
    const manifest = /** @type {Array<{ name: string }>} */ (
        /** @type {unknown[]} */ (readIconsManifestFile(ICONS_NEXT_JSON_PATH))
    );
    const manifestNames = new Set(manifest.map(entry => entry.name));
    const newIconNames = [...outlinedIconNames].filter(name => !manifestNames.has(name)).sort();

    if (newIconNames.length > 0) {
        const invalidNames = newIconNames.filter(
            name => !ICON_NAME_PATTERN.test(name) || name !== canonicalIconName(name),
        );
        if (invalidNames.length > 0) {
            throw new Error(
                formatIssues(
                    "Invalid next icon file names (use lowercase kebab-case basenames; see icons:verify)",
                    invalidNames.map(name => `"${name}" (canonical: "${canonicalIconName(name)}")`),
                ),
            );
        }

        logger.header("Appending new icons to manifest");
        logger.success(`Found ${newIconNames.length} new icon(s) not yet in icons-next.json.`);
        logger.item(newIconNames.join(", "));

        writeFileSync(
            ICONS_NEXT_JSON_PATH,
            insertIconsNextEntries(
                readFileSync(ICONS_NEXT_JSON_PATH, "utf8"),
                newIconNames.map(name => ({ hasFilled: filledIconNames.has(name), name })),
            ),
        );
    }

    printNextPostRunSummary({
        filledCount: filledIconNames.size,
        newIconNames,
        optimizedFiles,
        outlinedCount: outlinedIconNames.size,
    });

    return { newIconNames, optimizedFiles };
}

/**
 * Splice new entries into `icons-next.json` as text, in sorted position
 *
 * @param {string} contents current file contents
 * @param {Array<{name: string, hasFilled: boolean}>} entries sorted by name
 * @returns {string}
 */
export function insertIconsNextEntries(contents, entries) {
    let updated = contents;
    for (const { name, hasFilled } of entries) {
        const block = `    {\n        "name": "${name}",\n        "hasFilled": ${hasFilled},\n        "tags": []\n    }`;
        // Anchor on the first entry that sorts after this one. Names are unique, so this matches once.
        const successor = [...updated.matchAll(/^ {4}\{\n {8}"name": "([^"]+)",$/gm)].find(
            match => match[1].localeCompare(name) > 0,
        );
        if (successor === undefined) {
            // Sorts last: append after the final entry, which has no trailing comma.
            updated = `${updated.replace(/\n\]\n?$/, "")},\n${block}\n]\n`;
        } else {
            updated = `${updated.slice(0, successor.index)}${block},\n${updated.slice(successor.index)}`;
        }
    }
    return updated;
}

/**
 * @param {Set<string>} iconNames16
 * @param {Set<string>} iconNames20
 */
export function getParityIssues(iconNames16, iconNames20) {
    const { onlyIn16, onlyIn20 } = iconDirectoryParityDiff(iconNames16, iconNames20);
    return [
        ...onlyIn16.map(name => `"${name}" exists in resources/icons/16px but not resources/icons/20px`),
        ...onlyIn20.map(name => `"${name}" exists in resources/icons/20px but not resources/icons/16px`),
    ];
}

/**
 * @param {string} jsonPath
 * @param {IconMetadata[]} manifest
 */
export function writeIconsManifest(jsonPath, manifest) {
    writeFileSync(jsonPath, `${JSON.stringify(manifest, null, 4)}\n`);
}

/**
 * @param {string} title
 * @param {string[]} issues
 */
export function formatIssues(title, issues) {
    return [title, ...issues.map(issue => `- ${issue}`)].join("\n");
}

/**
 * @param {{
 *   addedManifestEntries: IconMetadata[];
 *   newIconNames: string[];
 *   optimizedFiles: Array<{ path: string; iconName: string }>;
 *   pairedCount: number;
 * }} args
 */
function printPostRunSummary({ newIconNames, pairedCount, optimizedFiles, addedManifestEntries }) {
    logger.header("Summary");
    logger.info(`Paired icons checked: ${pairedCount}`);
    if (optimizedFiles.length === 0) {
        logger.success("Normalized 0 SVG file(s) (already matched canonical SVGO output).");
    } else {
        logger.success(`Normalized ${optimizedFiles.length} SVG file(s).`);
    }
    logger.success(
        `Appended ${addedManifestEntries.length} manifest entr${addedManifestEntries.length === 1 ? "y" : "ies"}.`,
    );
    for (const entry of addedManifestEntries) {
        logger.item(`${entry.iconName} -> codepoint ${entry.codepoint}`);
    }
    if (addedManifestEntries.length > 0) {
        logger.warn('Next step: manually update "tags" and "group" for new entries in packages/icons/icons.json.');
        logger.info(`Added icon names: ${newIconNames.join(", ")}`);
    }
}

/**
 * @param {{
 *   filledCount: number;
 *   newIconNames: string[];
 *   optimizedFiles: Array<{ path: string; iconName: string }>;
 *   outlinedCount: number;
 * }} args
 */
function printNextPostRunSummary({ filledCount, newIconNames, optimizedFiles, outlinedCount }) {
    logger.header("Summary (next)");
    logger.info(`Next icons checked: ${outlinedCount} outlined, ${filledCount} filled`);
    if (optimizedFiles.length === 0) {
        logger.success("Normalized 0 SVG file(s) (already matched canonical SVGO output).");
    } else {
        logger.success(`Normalized ${optimizedFiles.length} SVG file(s).`);
    }
    logger.success(`Appended ${newIconNames.length} manifest entr${newIconNames.length === 1 ? "y" : "ies"}.`);
    if (newIconNames.length > 0) {
        logger.warn('Next step: manually add "tags" for new entries in packages/icons/icons-next.json.');
        logger.info(`Added icon names: ${newIconNames.join(", ")}`);
    }
}

async function main() {
    try {
        await addIcons();
        await addNextIcons();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(message);
        process.exitCode = 1;
    }
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main();
}
