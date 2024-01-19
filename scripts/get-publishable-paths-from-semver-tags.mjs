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

const cli = yargs(argv.slice(2)).usage("$0 <commitish>").help();
const args = await cli.argv;
const commitish = args._[0] || "HEAD";
const monorepoRootDir = join(import.meta.dirname, "..");

exec(`git tag --points-at ${commitish}`, async (err, stdout) => {
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

    const taggedPackages = taggedPackageNames.map(async name => {
        const nameParts = name.split("/");
        const unscopedName = nameParts[nameParts.length - 1];
        const packagePath = join("packages", unscopedName);
        const manifestPath = join(monorepoRootDir, packagePath, "package.json");
        // This will throw if the package name isn't also the path, which is desirable.
        const { default: packageJson } = await import(manifestPath, { with: { type: "json" } });
        return {
            packageJson,
            path: packagePath,
        };
    });

    const publishablePackagePaths = (await Promise.all(taggedPackages))
        .filter(({ packageJson }) => !packageJson.private)
        .map(pkg => pkg.path);

    publishablePackagePaths.forEach(pkgPath => console.info(pkgPath));
});
