#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

// @ts-check
const dm = require("@documentalist/compiler");
const fs = require("fs");
const path = require("path");
const semver = require("semver");

const { Classes } = require("@blueprintjs/core/lib/cjs/common");

const docsUtils = require("./docsUtils");

// assume we are running from packages/docs-app
const ROOT_DIR = path.resolve(process.cwd(), "../../");
const GENERATED_SRC_DIR = path.resolve(process.cwd(), "./src/generated");
const NAV_PAGE_NAME = "_nav";

const DOCS_DATA_PATH = path.join(GENERATED_SRC_DIR, "docs.json");

(async () => {
    try {
        if (!fs.existsSync(GENERATED_SRC_DIR)) {
            fs.mkdirSync(GENERATED_SRC_DIR);
        }
        await generateDocumentalistData();
    } catch (err) {
        // console.error messages get swallowed by lerna but console.log is emitted to terminal.
        console.error(`[docs-data] ERROR when generating JSON docs data:`);
        console.error(err);
        process.exit(1);
    }

    console.info(`[docs-data] successfully generated docs.json`);
    process.exit(0);
})();

/**
 * Run documentalist to generate docs data from source code.
 */
function generateDocumentalistData() {
    return new dm.Documentalist({
        markdown: { renderer: docsUtils.markedRenderer },
        sourceBaseDir: ROOT_DIR,
        // must mark our @Decorator APIs as reserved so we can use them in code samples
        reservedTags: ["import", "ContextMenuTarget", "HotkeysTarget"],
    })
        .use(".md", new dm.MarkdownPlugin({ navPage: NAV_PAGE_NAME }))
        .use(
            /\.tsx?$/,
            new dm.TypescriptPlugin({
                excludeNames: [/I.+State$/],
                excludePaths: ["node_modules/", "-app/", "test-commons/"],
                tsconfigPath: path.resolve(__dirname, "../../config/tsconfig.base.json"),
            }),
        )
        .use(".scss", new dm.KssPlugin())
        .use("package.json", new dm.NpmPlugin())
        .documentGlobs("../*/src/**/*.{scss,md}", "../*/src/index.{ts,tsx}", "../*/package.json")
        .then(docs => JSON.stringify(docs, transformDocumentalistData, 2))
        .then(content => fs.writeFileSync(DOCS_DATA_PATH, content));
}

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
        return replaceNS(value);
    }
    return undefined;
}

/** @param {any} text replace `#{$ns}` with Blueprint class namespace. if not a string, simply returns `text`. */
function replaceNS(text) {
    return typeof text === "string" ? text.replace(/#{\$ns}|@ns/g, Classes.getClassNamespace()) : text;
}
