/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { createRequire } from "node:module";
import { join } from "node:path";
import { cwd } from "node:process";

/**
 * Read a package name from package.json.
 *
 * @returns {string | undefined}
 */
export function getPackageName() {
    // TODO: refactor to use `await import()`, requires breaking change to make this API async
    // see https://nodejs.org/docs/latest-v20.x/api/esm.html#import-attributes
    const require = createRequire(import.meta.url);
    /** @type {string | undefined} */
    let name;
    try {
        name = require(join(cwd(), "package.json")).name;
        if (name === undefined) {
            throw new Error("package.json has no name field");
        }
        // strip NPM scope, if possible
        const nameSplit = name.split("/");
        if (nameSplit.length > 1) {
            name = nameSplit[1];
        }
    } catch (e) {
        console.error("[webpack-build-scripts] Couldn't read package name from package.json", e);
    }
    return name;
}
