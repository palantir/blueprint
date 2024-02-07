/*
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

// @ts-check

import { basename, dirname, extname, join, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { cwd } from "node:process";
import { packageUpSync } from "package-up";
import { URL, fileURLToPath, pathToFileURL } from "node:url";
import * as sass from "sass";

const BLUEPRINT_SCOPE = "@blueprintjs";

const maybeMonorepoPackageJsonPath = packageUpSync({ cwd: resolve(join(cwd(), "..")) });
let isBlueprintSourceMonorepo = false;

if (maybeMonorepoPackageJsonPath !== undefined) {
    const monorepoPackageJson = JSON.parse(readFileSync(maybeMonorepoPackageJsonPath, "utf8"));
    const monorepoName = monorepoPackageJson.name;
    if (monorepoName === `${BLUEPRINT_SCOPE}/root`) {
        isBlueprintSourceMonorepo = true;
    }
}

/**
 * Custom importer which controls how Sass resolves loads from rules like
 * [`@use`](https://sass-lang.com/documentation/at-rules/use) and
 * [`@import`](https://sass-lang.com/documentation/at-rules/import).
 *
 * This importer allows monorepo imports to be resolved correctly by Sass with Yarn PnP enabled.
 *
 * @type {sass.FileImporter}
 */
export default {
    /**
     * If `url` is recognized by this importer, returns its canonical format.
     * Otherwise, returns `null` to delegate to the default importer.
     *
     * @param {string} url
     * @param {sass.CanonicalizeContext} context
     */
    findFileUrl: (url, context) => {
        const [scope, packageName, ...rest] = url.split("/");

        if (isBlueprintSourceMonorepo && scope === BLUEPRINT_SCOPE) {
            const fileName = rest.at(-1);

            if (maybeMonorepoPackageJsonPath === undefined || fileName === undefined) {
                // should be unreachable, this would be a malformed import url
                return null;
            }

            const filePath = resolve(dirname(maybeMonorepoPackageJsonPath), "packages", packageName, ...rest);

            return pathToFileURL(filePath);
        }

        return null;
    },
};
