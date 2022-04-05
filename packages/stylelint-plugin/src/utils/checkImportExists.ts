/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import type { Root } from "postcss";

/**
 * Returns true if the given import exists in the file, otherwise returns false.
 * If `importPath` is an array, any of the strings has to match in order fortrue to be returned.
 */
export function checkImportExists(root: Root, importPath: string | string[]): boolean {
    let hasBpVarsImport = false;
    root.walkAtRules(/^import$/i, atRule => {
        for (const path of typeof importPath === "string" ? [importPath] : importPath) {
            if (stripQuotes(stripLessReference(atRule.params)) === path) {
                hasBpVarsImport = true;
                return false; // Stop the iteration
            }
        }
        return;
    });
    return hasBpVarsImport;
}

function stripLessReference(str: string): string {
    const LESS_REFERENCE = "(reference)";
    if (str.startsWith(`${LESS_REFERENCE} `)) {
        return str.substring(LESS_REFERENCE.length + 1, str.length);
    }
    return str;
}

function stripQuotes(str: string): string {
    if (
        (str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') ||
        (str.charAt(0) === "'" && str.charAt(str.length - 1) === "'")
    ) {
        return str.substring(1, str.length - 1);
    }
    return str;
}
