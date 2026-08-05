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
 * Validate `icons-name-map.json` (legacy icon name → next-generation icon name). Shared by the
 * generator ({@link file://./generate-icon-name-map.mjs}) and the verifier
 * ({@link file://./verify-icons.mjs}) so both enforce identical rules.
 *
 * Enforces: every current legacy icon has a mapping; every value is a current next (outlined) icon;
 * and there are no duplicate keys. Historical legacy keys are intentionally allowed so the map can
 * remain a durable compatibility ledger after a legacy SVG is removed.
 *
 * @param {string} rawMap raw file contents (for duplicate-key detection, which `JSON.parse` hides)
 * @param {Record<string, unknown>} iconNameMap parsed map
 * @param {Set<string>} legacyIconNames basenames of `resources/icons/16px`
 * @param {Set<string>} nextIconNames basenames of `resources/icons/next/outlined`
 * @returns {string[]} validation errors (empty if valid)
 */
export function validateIconNameMap(rawMap, iconNameMap, legacyIconNames, nextIconNames) {
    /** @type {string[]} */
    const errors = [];

    // Detect duplicate keys, which JSON.parse silently collapses to the last value. We match every
    // quoted token immediately followed by a colon (a key, wherever it sits) rather than anchoring to
    // line starts, so the check is independent of how `icons-name-map.json` happens to be formatted.
    const seen = new Set();
    for (const match of rawMap.matchAll(/"((?:[^"\\]|\\.)*)"\s*:/g)) {
        const key = match[1];
        if (seen.has(key)) {
            errors.push(`icons-name-map.json has duplicate key "${key}"`);
        }
        seen.add(key);
    }

    // Coverage: every legacy icon must have a mapping.
    for (const legacyName of legacyIconNames) {
        if (!Object.prototype.hasOwnProperty.call(iconNameMap, legacyName)) {
            errors.push(`legacy icon "${legacyName}" has no entry in icons-name-map.json`);
        }
    }

    for (const [legacyName, nextName] of Object.entries(iconNameMap)) {
        if (typeof nextName !== "string") {
            errors.push(`icons-name-map.json value for "${legacyName}" must be a string`);
        } else if (!nextIconNames.has(nextName)) {
            errors.push(
                `icons-name-map.json maps "${legacyName}" to "${nextName}", which is not a next icon (no resources/icons/next/outlined/${nextName}.svg)`,
            );
        }
    }

    return errors;
}
