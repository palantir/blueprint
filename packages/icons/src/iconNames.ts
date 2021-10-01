/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

/* eslint-disable camelcase */

import { snakeCase } from "change-case";

// icon sets are identical aside from SVG paths, so we just import the info for the 16px set
import { BlueprintIcons_16, BlueprintIcons_16Id, BlueprintIcons_16Key } from "./generated/16px/blueprint-icons-16";

const IconNamesLegacy: Record<string, BlueprintIcons_16Id> = {};

for (const [pascalCaseKey, iconName] of Object.entries(BlueprintIcons_16)) {
    const screamingSnakeCaseKey = snakeCase(pascalCaseKey).toUpperCase();
    IconNamesLegacy[screamingSnakeCaseKey] = iconName;
}

export const IconNames = {
    ...BlueprintIcons_16,
    ...(IconNamesLegacy as Record<ScreamingSnakeCaseIconNames, BlueprintIcons_16Id>),
};

type ScreamingSnakeCaseIconNames = Uppercase<StripLeadingUnderscore<CamelToSnake<BlueprintIcons_16Key>>>;

/**
 * The CamelToSnake converter works ok for PascalCase identifiers, but it
 * always adds a leading underscore. So we add this simple additional converter
 * to the chain to strip that underscore.
 */
type StripLeadingUnderscore<T extends string> = T extends `_${infer R}` ? `${R}` : T;

/**
 * This is a hacky implementation of a camelCase to Snake_Case string literal
 * type converter... it works up to 30 characters, which is fine for our
 * current icon set.
 *
 * Copied from StackOverflow
 *
 * @see https://stackoverflow.com/questions/64932525/is-it-possible-to-use-mapped-types-in-typescript-to-change-a-types-key-names
 */
type CamelToSnake<T extends string> = string extends T
    ? string
    : T extends `${infer C0}${infer C1}${infer R}`
    ? `${C0 extends Uppercase<C0> ? "_" : ""}${Lowercase<C0>}${C1 extends Uppercase<C1>
          ? "_"
          : ""}${Lowercase<C1>}${CamelToSnake<R>}`
    : T extends `${infer C0}${infer R}`
    ? `${C0 extends Uppercase<C0> ? "_" : ""}${Lowercase<C0>}${CamelToSnake<R>}`
    : "";
