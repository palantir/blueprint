#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Asserts that all library packages adhere to the layout spec.
 */

// @ts-check

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { cwd, exit } from "node:process";
import { pathToFileURL } from "node:url";

// asserts that all main fields in package.json reference existing files
const PACKAGE_MAIN_FIELDS = ["main", "module", "style", "types", "typings", "unpkg"];

// TODO(adahiya): replace this with `await import("./package.json", { assert: { type: "json" } })` in Node 17.5+
const manifest = JSON.parse(readFileSync(pathToFileURL(join(cwd(), "package.json")), { encoding: "utf8" }));

for (const field of PACKAGE_MAIN_FIELDS.filter(f => manifest[f] !== undefined)) {
    if (!existsSync(resolve(cwd(), manifest[field]))) {
        console.error(
            `[node-build-scripts] Failed to validate package layout: expected '${manifest[field]}' to exist.`,
        );
        exit(1);
    }
}

console.info("[node-build-scripts] Successfully validated package layout.");
exit(0);
