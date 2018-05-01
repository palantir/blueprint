#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Asserts that all library packages adhere to the layout spec.
 */

// @ts-check
const fs = require("fs");
const path = require("path");

// asserts that all main fields in package.json reference existing files
const PACKAGE_MAIN_FIELDS = ["main", "module", "style", "types", "typings", "unpkg"];
const manifest = require(path.resolve(process.cwd(), "./package.json"));

for (const field of PACKAGE_MAIN_FIELDS.filter(f => manifest[f] !== undefined)) {
    if (!fs.existsSync(path.resolve(process.cwd(), manifest[field]))) {
        console.error(
            `[node-build-scripts] Failed to validate package layout: expected '${manifest[field]}' to exist.`,
        );
        process.exit(1);
    }
}

console.info("[node-build-scripts] Successfully validated package layout.");
process.exit(0);
