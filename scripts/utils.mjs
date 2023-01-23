/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptsDirPath = fileURLToPath(new URL(".", import.meta.url));

/**
 * @param {string[]} paths
 */
export function loadJsonFile(...paths) {
    const packageJsonPath = resolve(scriptsDirPath, ...paths);
    // TODO(adahiya): replace this with `await import(packageJsonPath, { assert: { type: "json" } })` in Node 17.5+
    return JSON.parse(readFileSync(pathToFileURL(packageJsonPath), { encoding: "utf8" }));
}
