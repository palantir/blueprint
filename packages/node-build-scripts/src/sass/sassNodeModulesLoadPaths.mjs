/*
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

// @ts-check

import { dirname, join, resolve } from "node:path";
import { cwd } from "node:process";
import { pkgUpSync } from "pkg-up";

const packageJsonPath = pkgUpSync({ cwd: cwd() });
if (packageJsonPath === undefined) {
    throw new Error(
        `[node-build-scripts] Unable to generate Sass loadPaths, make sure there is a package.json file and node_modules directory`,
    );
}

const nodeModulesDirectory = resolve(join(dirname(packageJsonPath), "node_modules"));
const maybeMonorepoPackageJsonPath = pkgUpSync({ cwd: resolve(join(cwd(), "..")) });

/**
 * Path to preferred node_modules folder to load Sass file imports from.
 *
 * @type {string[]}
 */
export const loadPaths = [nodeModulesDirectory];

if (maybeMonorepoPackageJsonPath !== undefined) {
    loadPaths.unshift(join(dirname(maybeMonorepoPackageJsonPath), "node_modules"));
}
