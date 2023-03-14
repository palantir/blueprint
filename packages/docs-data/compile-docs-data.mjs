#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

// @ts-check

import { Documentalist, KssPlugin, MarkdownPlugin, NpmPlugin, TypescriptPlugin } from "@documentalist/compiler";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import semver from "semver";

import { Classes } from "@blueprintjs/core";

import { markedRenderer } from "./markdownRenderer.mjs";

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
        markdown: { renderer: markedRenderer },
        sourceBaseDir: monorepoRootDir,
        // must mark our @Decorator APIs as reserved so we can use them in code samples
        reservedTags: ["import", "ContextMenuTarget", "HotkeysTarget", "param", "returns"],
    })
        .use(".md", {
            compile: files =>
                process.platform === "win32" ? files.map(file => file.read().replace(/\r\n/g, "\n")) : files,
        })
        .use(".md", new MarkdownPlugin({ navPage: "_nav" }))
        .use(
            /\.tsx?$/,
            new TypescriptPlugin({
                excludeNames: [/I.+State$/],
                excludePaths: ["node_modules/", "-app/", "test-commons/", "-build-scripts/"],
                tsconfigPath: resolve(monorepoRootDir, "./config/tsconfig.base.json"),
            }),
        )
        .use(".scss", new KssPlugin())
        .use("package.json", new NpmPlugin());

    const docs = await documentalist.documentGlobs(
        "../*/src/**/*.{scss,md}",
        "../*/src/index.{ts,tsx}",
        "../*/package.json",
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
    if (value != null) {
        return interpolateClassNamespace(value);
    }
    return undefined;
}

/**
 * If value is a string, replaces `#{$ns}` in that string with the actual Blueprint class namespace.
 * Otherwise, simply returns the value.
 *
 * @param {any} value
 */
function interpolateClassNamespace(value) {
    return typeof value === "string" ? value.replace(/#{\$ns}|@ns/g, Classes.getClassNamespace()) : value;
}
