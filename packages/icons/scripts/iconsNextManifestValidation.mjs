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

/**
 * Validate `icons-next.json` (the next-generation icon manifest) against the SVGs on disk.
 *
 * Enforces: each entry is a well-formed object (`{ name: string, hasFilled: boolean, tags: string[] }`);
 * no duplicate names; `hasFilled` matches whether a filled SVG exists; the manifest and the outlined
 * directory line up both ways; and every filled icon has an outlined counterpart.
 *
 * @param {readonly unknown[]} manifest parsed `icons-next.json` (entries are untrusted)
 * @param {Set<string>} outlinedIconNames basenames of `resources/icons/next/outlined`
 * @param {Set<string>} filledIconNames basenames of `resources/icons/next/filled`
 * @returns {string[]} validation errors (empty if valid)
 */
export function validateIconsNextManifest(manifest, outlinedIconNames, filledIconNames) {
    /** @type {string[]} */
    const errors = [];
    const manifestNames = new Set();

    for (const [index, rawEntry] of manifest.entries()) {
        const label = `icons-next.json[${index}]`;
        if (rawEntry == null || typeof rawEntry !== "object") {
            errors.push(`${label} must be an object`);
            continue;
        }
        const entry = /** @type {{ name?: unknown; hasFilled?: unknown; tags?: unknown }} */ (rawEntry);
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

            const hasFilledOnDisk = filledIconNames.has(entry.name);
            if (entry.hasFilled !== hasFilledOnDisk) {
                errors.push(
                    `icons-next.json icon "${entry.name}" has hasFilled=${entry.hasFilled} but filled SVG ${
                        hasFilledOnDisk ? "exists" : "is missing"
                    }`,
                );
            }
        }
    }

    for (const iconName of outlinedIconNames) {
        if (!manifestNames.has(iconName)) {
            errors.push(`resources/icons/next/outlined/${iconName}.svg has no entry in icons-next.json`);
        }
    }

    for (const name of manifestNames) {
        if (!outlinedIconNames.has(name)) {
            errors.push(`icons-next.json icon "${name}" is missing resources/icons/next/outlined/${name}.svg`);
        }
    }

    const missingOutlined = [...filledIconNames].filter(name => !outlinedIconNames.has(name));
    if (missingOutlined.length > 0) {
        errors.push(
            `Filled next icon SVGs must have outlined counterparts. Missing outlined files: ${missingOutlined.join(", ")}`,
        );
    }

    return errors;
}
