#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Finds the subset of packages which are ready to be published based on the latest Lerna publish commit.
 */

// @ts-check

import { exec } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { argv } from "node:process";
import { pathToFileURL } from "node:url";
import yargs from "yargs";

const cli = yargs(argv.slice(2)).usage("$0 <commitish>").help();
const args = await cli.argv;
const commitish = args._[0] || "HEAD";

exec(`git tag --points-at ${commitish}`, (err, stdout) => {
    if (err) {
        throw err;
    }

    /** @type {string[]} */
    // @ts-ignore
    const taggedPackageNames = stdout
        .toString()
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(tag => {
            const match = /^(.+)\@([^@]+)$/.exec(tag);
            if (!match) {
                return null;
            } else {
                return match[1];
            }
        })
        .filter(name => name != null);

    const publishablePackagePaths = taggedPackageNames
        .map(name => {
            const nameParts = name.split("/");
            const unscopedName = nameParts[nameParts.length - 1];
            const packagePath = join("packages", unscopedName);
            return {
                // This will throw if the package name isn't also the path, which is desirable.
                packageJson: loadPackageJson(packagePath),
                path: packagePath,
            };
        })
        .filter(({ packageJson }) => !packageJson.private)
        .map(pkg => pkg.path);

    publishablePackagePaths.forEach(pkgPath => console.info(pkgPath));
});

/**
 * @param {string} packagePath
 */
function loadPackageJson(packagePath) {
    const packageJsonPath = resolve(packagePath, "package.json");
    // TODO(adahiya): replace this with `await import(packageJsonPath, { assert: { type: "json" } })` in Node 17.5+
    return JSON.parse(readFileSync(pathToFileURL(packageJsonPath), { encoding: "utf8" }));
}
