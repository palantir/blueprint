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
 * TODO: consider using Yarn's file system APIs to resolve monorepo imports, assuming that it places
 * "workspace:*" dependencies in the same place as other node_modules with PnP
 * (see https://gist.github.com/kubijo/8c2346dcfe6a3380a700906c4bd6bb04).
 *
 * @type {sass.FileImporter<"sync">}
 */
export const fileImporter = {
    /**
     * If `url` is recognized by this importer, returns its canonical format.
     * Otherwise, returns `null` to delegate to the default importer.
     *
     * @param {string} url
     * @returns {URL | null}
     */
    findFileUrl: url => {
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

const VALID_SCSS_EXTENSIONS = [".scss", ".css"];

/**
 * @type {sass.Importer<"sync">}
 */
export const importer = {
    /**
     * If `url` is recognized by this importer, returns its canonical format.
     * Otherwise, returns `null` to delegate to the default importer.
     *
     * @param {string} url
     * @param {sass.CanonicalizeContext} context
     */
    canonicalize: (url, context) => {
        return fileImporter.findFileUrl(url, context);
    },

    load: canonicalUrl => {
        const canonicalPath = fileURLToPath(canonicalUrl);
        let realPath;

        if (existsSync(canonicalPath)) {
            realPath = canonicalPath;
        } else {
            // the real path of the file on disk may be prefixed with '_' if it's a partial
            // and suffixed with a file extension (which may be omitted in the import statement)
            const ext = extname(canonicalPath);

            if (ext.length > 0) {
                if (VALID_SCSS_EXTENSIONS.includes(ext)) {
                    // has a valid file extension, let' just try the partial
                    const base = basename(canonicalPath, ext);
                    const pathAsPartial = canonicalPath.replace(`${base}${ext}`, `_${base}${ext}`);
                    if (existsSync(pathAsPartial)) {
                        realPath = pathAsPartial;
                    }
                } else {
                    // can't load this file, it has an invalid extension
                    return null;
                }
            } else {
                const base = basename(canonicalPath);
                // try all valid extensions
                for (const validExt of VALID_SCSS_EXTENSIONS) {
                    const pathWithExt = `${canonicalPath}${validExt}`;
                    if (existsSync(pathWithExt)) {
                        realPath = pathWithExt;
                        break;
                    } else {
                        const pathAsPartialWithExt = pathWithExt.replace(base, `_${base}`);
                        if (existsSync(pathAsPartialWithExt)) {
                            realPath = pathAsPartialWithExt;
                            break;
                        }
                    }
                }
            }
        }

        if (realPath === undefined) {
            return null;
        }

        return {
            contents: readFileSync(realPath, "utf8"),
            syntax: "scss",
        };
    },
};

/**
 * @param {string} importPath
 * @param {sass.CanonicalizeContext} context
 */
export const sassLoaderImporter = (importPath, context) => {
    const canonicalUrl = fileImporter.findFileUrl(importPath, context);
    if (canonicalUrl == null) {
        return null;
    }

    return importer.load(canonicalUrl);
};
