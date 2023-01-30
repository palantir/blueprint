/*
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

// @ts-check

import { dirname, join, resolve } from "node:path";
import { cwd } from "node:process";
import { pkgUpSync } from "pkg-up";
import sassAlias from "sass-alias";

const packageJsonPath = pkgUpSync({ cwd: cwd() });
if (packageJsonPath === undefined) {
    throw new Error(
        `[node-build-scripts] Unable to create sass-alias importer, make sure there is a package.json file and node_modules directory`,
    );
}

const nodeModulesDirectory = join(dirname(packageJsonPath), "node_modules");

console.log(`creating sass-alias...`, nodeModulesDirectory);
export default sassAlias.create({
    "~": resolve(nodeModulesDirectory) + "/",
});
