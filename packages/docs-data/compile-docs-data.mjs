#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

// @ts-check

import { Documentalist, KssPlugin, MarkdownPlugin, NpmPlugin, TypescriptPlugin } from "@documentalist/compiler";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import semver from "semver";

import { Classes } from "@blueprintjs/core";

import { hooks, markedRenderer } from "./markdownRenderer.mjs";
import { navigationConfig } from "./src/nav.config.js";

/** Run Documentalist on Sass, TypeScript, and package.json files in these packages */
const LIBRARY_PACKAGES = ["core", "datetime", "datetime2", "icons", "select", "table", "labs"];

/** This package is expected to have the markdown "navPage" */
const DOCS_PACKAGE = "docs-app";

/** Run Documentalist on Markdown files in these packages */
const LIBRARY_AND_DOCS_PACKAGES = [...LIBRARY_PACKAGES, DOCS_PACKAGE];

console.info(`[docs-data] compiling documentation for library packages: ${LIBRARY_PACKAGES.join(", ")}`);

// assume we are running from packages/docs-app
const monorepoRootDir = resolve(cwd(), "../../");
const generatedSrcDir = resolve(cwd(), "./src/generated");
const docsDataFilePath = join(generatedSrcDir, "docs.json");

try {
    if (!existsSync(generatedSrcDir)) {
        mkdirSync(generatedSrcDir);
    }
    await generateDocumentalistData();
} catch (err) {
    // console.error messages get swallowed by lerna but console.log is emitted to terminal.
    console.error(`[docs-data] ERROR when generating JSON docs data:`);
    throw new Error(err);
}

console.info(`[docs-data] successfully generated docs.json`);

/**
 * Run documentalist to generate docs data from source code.
 *
 * @returns {Promise<void>}
 */
async function generateDocumentalistData() {
    const documentalist = new Documentalist({
        markdown: {
            hooks,
            renderer: markedRenderer,
        },
        // must mark our @Decorator APIs as reserved so we can use them in code samples
        reservedTags: ["import", "ContextMenuTarget", "HotkeysTarget", "param", "returns", "use"],
        sourceBaseDir: monorepoRootDir,
    })
        .use(".md", {
            compile: files =>
                // HACKHACK: special case for Windows environment
                // see https://github.com/palantir/documentalist/issues/98
                process.platform === "win32" ? files.map(file => file.read().replace(/\r\n/g, "\n")) : files,
        })
        // navPage option points to placeholder file - actual nav tree is built from nav.config.js
        .use(".md", new MarkdownPlugin({ navPage: "_nav" }))
        .use(
            /\.tsx?$/,
            new TypescriptPlugin({
                excludeNames: [/.+State$/],
                excludePaths: ["node_modules/", "-app/", "test-commons/", "-build-scripts/", "test/"],
                verbose: true,
            }),
        )
        .use(".scss", new KssPlugin())
        .use("package.json", new NpmPlugin());

    const docs = await documentalist.documentGlobs(
        `../{${LIBRARY_AND_DOCS_PACKAGES.join(",")}}/src/**/*.md`,
        `../{${LIBRARY_PACKAGES.join(",")}}/src/**/*.scss`,
        `../{${LIBRARY_PACKAGES.join(",")}}/src/index.ts`,
        `../{${LIBRARY_PACKAGES}}/package.json`,
    );

    // Replace Documentalist's nav with our explicit tree from nav.config.js
    docs.nav = processNavConfig(navigationConfig, 1);

    const content = JSON.stringify(docs, transformDocumentalistData, 2);
    return writeFileSync(docsDataFilePath, content);
}

/**
 * Recursively process nav config: add levels and resolve package metadata.
 *
 * @param {import("@blueprintjs/docs-theme").NavItemConfig[]} items
 * @param {number} level
 * @returns {import("@blueprintjs/docs-theme").NavItem[]}
 */
function processNavConfig(items, level) {
    return items.map(item => {
        const route = item.route;
        // Extract reference from route (last part after slash, or the whole route)
        const reference = route.includes("/") ? route.split("/").pop() : route;

        /** @type {import("@blueprintjs/docs-theme").NavItem} */
        const processed = {
            route,
            title: item.title,
            level,
            children: item.children ? processNavConfig(item.children, level + 1) : [],
            reference,
        };

        // Resolve package metadata if packageName is specified
        if (item.packageName) {
            const { version, npmLink } = resolvePackageMetadata(item.packageName);
            if (version) {
                processed.version = version;
            }
            if (npmLink) {
                processed.npmLink = npmLink;
            }
        }

        return processed;
    });
}

/**
 * Read version from package.json and derive npm link.
 *
 * @param {string} packageName
 * @returns {{ version: string | undefined, npmLink: string | undefined }}
 */
function resolvePackageMetadata(packageName) {
    // Convert @blueprintjs/datetime -> packages/datetime/package.json
    const shortName = packageName.replace("@blueprintjs/", "");
    const packageJsonPath = resolve(monorepoRootDir, `packages/${shortName}/package.json`);

    try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        return {
            version: pkg.version,
            npmLink: `https://www.npmjs.com/package/${packageName}`,
        };
    } catch (e) {
        console.warn(`[docs-data] Could not resolve package metadata for ${packageName}:`, e.message);
        return { version: undefined, npmLink: undefined };
    }
}

/**
 * @param {string} key
 * @param {any} value
 * @returns {any}
 */
function transformDocumentalistData(key, value) {
    if (key === "versions" && Array.isArray(value)) {
        // one major version per release
        const majors = new Map();
        for (const version of value) {
            const major = semver.major(version);
            if (!majors.has(major) || semver.gt(version, majors.get(major))) {
                majors.set(major, version);
            }
        }
        // reverse the list so highest version is first (easier indexing)
        return Array.from(majors.values()).reverse();
    }

    if (typeof value === "string") {
        return interpolateClassNamespace(value);
    }

    return value;
}

/**
 * Replaces `#{$ns}` placeholder in string values  with the actual Blueprint class namespace.
 *
 * @param {string} value
 */
function interpolateClassNamespace(value) {
    return value.replace(/#{\$ns}|@ns/g, Classes.getClassNamespace());
}
