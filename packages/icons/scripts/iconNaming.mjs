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

import { paramCase } from "change-case";

/** Lowercase kebab-case segments only (matches Blueprint icon filenames / IconName strings). */
export const ICON_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Normalize a resource basename or manifest iconName to canonical kebab-case (lowercase).
 * Uses the same rules as `kebab-case` (hyphen delimiter, collapses underscores/spaces/camelCase).
 *
 * @param {string} name
 */
export function canonicalIconName(name) {
    return paramCase(name);
}
