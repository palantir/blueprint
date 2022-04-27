/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import path from "path";

/**
 * Read a package name from package.json.
 */
export function getPackageName() {
    let name;
    try {
        name = require(path.join(process.cwd(), "package.json")).name;
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
