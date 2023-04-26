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

import { pascalCase } from "change-case";

import * as IconSvgPaths16 from "./generated/16px/paths";
import * as IconSvgPaths20 from "./generated/20px/paths";
import type { IconName } from "./iconNames";
import type { PascalCase } from "./type-utils";

export { IconSvgPaths16, IconSvgPaths20 };

/**
 * Type safe string literal conversion of snake-case icon names to PascalCase icon names.
 * This is useful for indexing into the SVG paths record to extract a single icon's SVG path definition.
 */
export function iconNameToPathsRecordKey(name: IconName): PascalCase<IconName> {
    return pascalCase(name) as PascalCase<IconName>;
}
