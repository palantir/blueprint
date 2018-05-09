#!/usr/bin/env node

/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

// @ts-check
const { Classes } = require("@blueprintjs/core/lib/cjs/common");
const { execSync, spawn } = require("child_process");
const dm = require("documentalist");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const semver = require("semver");
const docsUtils = require("./docsUtils");

// assume we are running from packages/docs-app
const ROOT_DIR = path.resolve(process.cwd(), "../../");
const PACKAGES_DIR = path.resolve(process.cwd(), "../");
const GENERATED_SRC_DIR = path.resolve(process.cwd(), "./src/generated");
const BUILD_DIR = path.resolve(process.cwd(), "build");
const NAV_PAGE_NAME = "_nav";

const DOCS_DATA_FILENAME = "docs.json";
const DOCS_RELEASES_FILENAME = "releases.json";
const DOCS_VERSIONS_FIELENAME = "versions.json";

(async () => {
    try {
        if (!fs.existsSync(GENERATED_SRC_DIR)) {
            fs.mkdirSync(GENERATED_SRC_DIR);
        }

        await generateDocumentalistData();
        generateReleasesData();
        generateVersionsData();
    } catch (err) {
        console.error(`[docs-data] Failed to generate JSON data:`);
        console.error(err);
        throw err;
    }
})();

/**
 * Run documentalist to generate docs data from source code.
 */
function generateDocumentalistData() {
    return new dm.Documentalist({
        markdown: { renderer: docsUtils.markedRenderer },
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
        .documentGlobs("../*/src/**/*.{scss,md}", "../*/src/index.{ts,tsx}")
        .then(docs => JSON.stringify(docs, transformDocumentalistData, 2))
        .then(content => fs.writeFileSync(path.join(GENERATED_SRC_DIR, DOCS_DATA_FILENAME), content));
}

function transformDocumentalistData(key, value) {
    // remove all class declarations as they're currently unused and only increase bundle size
    if (value != null && value.kind !== "class") {
        return replaceNS(value);
    }
    return undefined;
}

/**
 * Create a JSON file containing latest released version of each project
 */
function generateReleasesData() {
    const packageDirectories = fs
        .readdirSync(PACKAGES_DIR)
        .map(name => path.join(PACKAGES_DIR, name))
        .filter(source => fs.lstatSync(source).isDirectory());

    const releases = packageDirectories
        .filter(packagePath => fs.existsSync(path.resolve(packagePath, "package.json")))
        .map(packagePath => require(path.resolve(packagePath, "package.json")))
        // only include non-private projects
        .filter(project => !project.private)
        // just these two fields from package.json:
        .map(({ name, version }) => ({ name, version }));

    fs.writeFileSync(path.join(GENERATED_SRC_DIR, DOCS_RELEASES_FILENAME), JSON.stringify(releases, null, 2));
}

/**
 * Create a JSON file containing published versions of the documentation
 */
function generateVersionsData() {
    let stdout = "";
    const child = spawn("git", ["tag"]);
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", data => {
        stdout += data;
    });
    child.on("close", () => {
        /** @type {Map<string, string>} */
        const majorVersionMap = stdout
            .split("\n")
            // turn @blueprintjs/core@* tags into version numbers
            .filter(val => /\@blueprintjs\/core\@[1-9]\d*\.\d+\.\d+.*/.test(val))
            .map(val => val.slice("@blueprintjs/core@".length))
            .reduce((map, version) => {
                const major = semver.major(version);
                if (!map.has(major) || semver.gt(version, map.get(major))) {
                    map.set(major, version);
                }
                return map;
            }, new Map());
        // sort in reverse order (so latest is first)
        const majorVersions = Array.from(majorVersionMap.values()).sort(semver.rcompare);

        console.info("[docs-data] Major versions found:", majorVersions.join(", "));

        fs.writeFileSync(
            path.join(GENERATED_SRC_DIR, DOCS_VERSIONS_FIELENAME),
            JSON.stringify(strMapToObj(majorVersionMap), null, 2),
        );
    });
}

function strMapToObj(strMap) {
    const obj = Object.create(null);
    for (const [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}

/** @param {any} text replace `#{$ns}` with Blueprint class namespace. if not a string, simply returns `text`. */
function replaceNS(text) {
    return typeof text === "string" ? text.replace(/#{\$ns}|@ns/g, Classes.getClassNamespace()) : text;
}
