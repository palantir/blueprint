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

import type { IconPaths } from "../iconTypes";

import type { NextIconVariant } from "./iconLoaderNext";
import type { IconNextName } from "./iconNextNames";

/** Loader function signature for next icon paths. */
export type NextIconPathsLoader = (iconName: IconNextName, variant: NextIconVariant) => Promise<IconPaths>;

/**
 * Default dynamic loader for next icon paths. Loads all next icon paths into a single chunk.
 */
export const defaultNextIconPathsLoader: NextIconPathsLoader = async (name, variant) => {
    const pathsRecord: Record<string, IconPaths> = await import(
        /* webpackChunkName: "blueprint-next-icons-paths" */
        "./generated/paths"
    );
    const outlinedKey = pascalCase(name);
    const filledKey = `${outlinedKey}Filled`;
    const key = variant === "filled" && filledKey in pathsRecord ? filledKey : outlinedKey;

    if (process.env.NODE_ENV !== "production" && variant === "filled" && !(filledKey in pathsRecord)) {
        console.warn(`[Blueprint] Icon "${name}" does not have a filled variant. Falling back to outlined.`);
    }

    return pathsRecord[key];
};
