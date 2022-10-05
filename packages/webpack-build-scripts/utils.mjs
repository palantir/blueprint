/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import { createRequire } from "node:module";
import { join } from "node:path";
import { cwd } from "node:process";

/**
 * Read a package name from package.json.
 */
export function getPackageName() {
    const require = createRequire(import.meta.url);
    let name;
    try {
        name = require(join(cwd(), "package.json")).name;
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
