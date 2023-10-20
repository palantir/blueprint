/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import type { IconPathsLoader } from "../iconLoader";
import type { IconName } from "../iconNames";
import { type IconPaths, IconSize } from "../iconTypes";
import type { PascalCase } from "../type-utils";

/**
 * A dynamic loader for icon paths that generates separate chunks for the two size variants.
 */
export const splitPathsBySizeLoader: IconPathsLoader = async (name, size) => {
    const key = pascalCase(name) as PascalCase<IconName>;
    let pathsRecord: Record<PascalCase<IconName>, IconPaths>;

    if (size === IconSize.STANDARD) {
        pathsRecord = await import(
            /* webpackChunkName: "blueprint-icons-16px-paths" */
            "../generated/16px/paths"
        );
    } else {
        pathsRecord = await import(
            /* webpackChunkName: "blueprint-icons-20px-paths" */
            "../generated/20px/paths"
        );
    }

    return pathsRecord[key];
};
