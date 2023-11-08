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

import { pascalCase, snakeCase } from "change-case";

// The two icon sets are identical aside from SVG paths, so we only need to import info for the 16px set
import { BlueprintIcons_16, type BlueprintIcons_16Id as IconName } from "./generated/16px/blueprint-icons-16";
import type { PascalCase, ScreamingSnakeCase } from "./type-utils";

export type { IconName };

const IconNamesNew = {} as Record<PascalCase<IconName>, IconName>;
const IconNamesLegacy = {} as Record<ScreamingSnakeCase<IconName>, IconName>;

for (const name of Object.values(BlueprintIcons_16) as IconName[]) {
    IconNamesNew[pascalCase(name) as PascalCase<IconName>] = name;
    IconNamesLegacy[snakeCase(name).toUpperCase() as ScreamingSnakeCase<IconName>] = name;
}

export const IconNames = {
    ...IconNamesNew,
    ...IconNamesLegacy,
};

export const IconNamesSet = new Set(Object.values(IconNames));
