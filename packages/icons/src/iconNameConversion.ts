/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 *
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

import { type LegacyIconName, LegacyToIconNextNameMap } from "./generated/iconNameMap";
import type { IconName } from "./iconNames";
import { type IconNextName, IconNextNamesSet } from "./next/iconNextNames";

export { LegacyToIconNextNameMap, type LegacyIconName };

/**
 * Converts a name from the legacy icon set to its next-generation equivalent.
 *
 * This function always interprets its argument as a legacy name. This distinction matters for names
 * which exist in both sets but identify different glyphs, such as `"user"`.
 */
export function legacyIconNameToIconNextName(iconName: LegacyIconName): IconNextName;
export function legacyIconNameToIconNextName(iconName: string): IconNextName | undefined;
export function legacyIconNameToIconNextName(iconName: string): IconNextName | undefined {
    return Object.prototype.hasOwnProperty.call(LegacyToIconNextNameMap, iconName)
        ? LegacyToIconNextNameMap[iconName as LegacyIconName]
        : undefined;
}

/**
 * Normalizes a legacy or next-generation icon name to a next-generation icon name.
 *
 * Canonical next names take precedence when a string is valid in both icon sets. Use
 * {@link legacyIconNameToIconNextName} instead when the source is known to contain legacy names.
 */
export function iconNameToIconNextName(iconName: IconName | IconNextName): IconNextName;
export function iconNameToIconNextName(iconName: string): IconNextName | undefined;
export function iconNameToIconNextName(iconName: string): IconNextName | undefined {
    if (IconNextNamesSet.has(iconName as IconNextName)) {
        return iconName as IconNextName;
    }

    return legacyIconNameToIconNextName(iconName);
}
