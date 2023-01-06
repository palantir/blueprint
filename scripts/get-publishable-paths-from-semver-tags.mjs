#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Finds the subset of packages which are ready to be published based on the latest Lerna publish commit.
 */

// @ts-check

import { exec } from "node:child_process";
import { join } from "node:path";
import { argv } from "node:process";
import yargs from "yargs";

import { loadJsonFile } from "./utils.mjs";

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
                packageJson: loadJsonFile(packagePath, "package.json"),
                path: packagePath,
            };
        })
        .filter(({ packageJson }) => !packageJson.private)
        .map(pkg => pkg.path);

    publishablePackagePaths.forEach(pkgPath => console.info(pkgPath));
});
