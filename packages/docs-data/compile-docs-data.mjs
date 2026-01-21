#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

// @ts-check

import { watch } from "chokidar";
import { Documentalist, KssPlugin, MarkdownPlugin, NpmPlugin, TypescriptPlugin } from "@documentalist/compiler";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { argv, cwd } from "node:process";
import semver from "semver";
import yargs from "yargs";

import { Classes } from "@blueprintjs/core";

import { hooks, markedRenderer } from "./markdownRenderer.mjs";

/** Run Documentalist on Sass, TypeScript, and package.json files in these packages */
const LIBRARY_PACKAGES = ["core", "datetime", "datetime2", "icons", "select", "table", "labs"];

/** This package is expected to have the markdown "navPage" */
const DOCS_PACKAGE = "docs-app";

/** Run Documentalist on Markdown files in these packages */
const LIBRARY_AND_DOCS_PACKAGES = [...LIBRARY_PACKAGES, DOCS_PACKAGE];

// Parse CLI arguments
const args = yargs(argv.slice(2))
    .option("watch", {
        alias: "w",
        type: "boolean",
        description: "Watch mode - recompile on file changes",
        default: false,
    })
    .parseSync();

console.info(`[docs-data] compiling documentation for library packages: ${LIBRARY_PACKAGES.join(", ")}`);

// assume we are running from packages/docs-data
const monorepoRootDir = resolve(cwd(), "../../");
const generatedSrcDir = resolve(cwd(), "./src/generated");
const docsDataFilePath = join(generatedSrcDir, "docs.json");

/**
 * Simple debounce function
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} delay
 * @returns {(...args: Parameters<T>) => void}
 */
function debounce(fn, delay) {
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Compile docs data with error handling
 */
async function compileDocsData() {
    try {
        await generateDocumentalistData();
        console.info(`[docs-data] successfully generated docs.json`);
    } catch (err) {
        console.error(`[docs-data] ERROR when generating JSON docs data:`, err);
        if (!args.watch) {
            throw err;
        }
    }
}

// Ensure generated directory exists
if (!existsSync(generatedSrcDir)) {
    mkdirSync(generatedSrcDir);
}

// Initial compilation
await compileDocsData();

// Watch mode
if (args.watch) {
    const watchPatterns = [
        `${monorepoRootDir}/packages/{${LIBRARY_AND_DOCS_PACKAGES.join(",")}}/src/**/*.md`,
        `${monorepoRootDir}/packages/{${LIBRARY_PACKAGES.join(",")}}/src/**/*.tsx`,
        `${monorepoRootDir}/packages/{${LIBRARY_PACKAGES.join(",")}}/src/**/*.ts`,
        `${monorepoRootDir}/packages/{${LIBRARY_PACKAGES.join(",")}}/src/**/*.scss`,
    ];

    console.info(`[docs-data] watching for changes...`);

    const debouncedCompile = debounce(async (/** @type {string} */ fileName) => {
        console.info(`[docs-data] change detected: ${fileName}`);
        await compileDocsData();
    }, 300);

    const watcher = watch(watchPatterns, {
        persistent: true,
        ignoreInitial: true,
    });
    watcher.on("change", debouncedCompile);
    watcher.on("add", debouncedCompile);
}

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

    const content = JSON.stringify(docs, transformDocumentalistData, 2);
    return writeFileSync(docsDataFilePath, content);
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
