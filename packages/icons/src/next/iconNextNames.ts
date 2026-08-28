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

import { pascalCase } from "change-case";

import type { PascalCase } from "../type-utils";

import { type BlueprintIconsNext, nextIconManifest } from "./generated/manifest";

export type IconNextName = BlueprintIconsNext;

const IconNextNamesObject = {} as Record<PascalCase<BlueprintIconsNext>, BlueprintIconsNext>;

for (const { name } of nextIconManifest) {
    IconNextNamesObject[pascalCase(name) as PascalCase<BlueprintIconsNext>] = name;
}

/** Map of every next-generation icon name keyed by its PascalCase identifier (e.g. `IconNextNames.Buggy === "buggy"`). */
export const IconNextNames = IconNextNamesObject;

export const IconNextNamesSet = new Set<BlueprintIconsNext>(nextIconManifest.map(entry => entry.name));
