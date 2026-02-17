#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

// @ts-check

import { Documentalist, KssPlugin, MarkdownPlugin, NpmPlugin, TypescriptPlugin } from "@documentalist/compiler";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import semver from "semver";

import { Classes } from "@blueprintjs/core";

import { hooks, markedRenderer } from "./markdownRenderer.mjs";

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
        .use(/\.mdx?$/, {
            compile: files =>
                // HACKHACK: special case for Windows environment
                // see https://github.com/palantir/documentalist/issues/98
                process.platform === "win32" ? files.map(file => file.read().replace(/\r\n/g, "\n")) : files,
        })
        .use(/\.mdx?$/, new MarkdownPlugin({ navPage: "_nav" }))
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
        `../{${LIBRARY_AND_DOCS_PACKAGES.join(",")}}/src/**/*.{md,mdx}`,
        `../{${LIBRARY_PACKAGES.join(",")}}/src/**/*.scss`,
        `../{${LIBRARY_PACKAGES.join(",")}}/src/index.ts`,
        `../{${LIBRARY_PACKAGES}}/package.json`,
    );

    // Post-process: replace documentalist's nav with one built from nav.json
    const navConfig = JSON.parse(readFileSync(new URL("./nav.json", import.meta.url), "utf-8"));
    applyNavConfig(docs, navConfig);

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

// ---------------------------------------------------------------------------
// Nav post-processing: build nav tree & fix routes from nav.json
// ---------------------------------------------------------------------------

/**
 * Applies the nav config to documentalist output: fixes page routes and
 * replaces the nav tree.
 *
 * @param {{ pages: Record<string, any>, nav: any[] }} docs
 * @param {Record<string, any[]>} navConfig
 */
function applyNavConfig(docs, navConfig) {
    // Step 2a: build route map
    const routeMap = buildRouteMap(navConfig);

    // Step 2b: fix routes in docs.pages
    fixPageRoutes(docs.pages, routeMap);

    // Step 2c + 2d: build nav tree and replace docs.nav
    docs.nav = buildNavTree(navConfig, docs.pages, routeMap);
}

/**
 * Walk nav config to compute the full route for every page reference.
 *
 * @param {Record<string, any[]>} navConfig
 * @returns {Map<string, string>}
 */
function buildRouteMap(navConfig) {
    /** @type {Map<string, string>} */
    const routeMap = new Map();

    /**
     * @param {string} ref
     * @param {string} parentRoute
     */
    function walk(ref, parentRoute) {
        const route = parentRoute ? `${parentRoute}/${ref}` : ref;
        routeMap.set(ref, route);
        const children = navConfig[ref];
        if (children) {
            for (const child of children) {
                if (typeof child === "string") {
                    walk(child, route);
                }
                // heading markers are skipped — they don't define pages
            }
        }
    }

    for (const ref of navConfig["_nav"]) {
        walk(ref, "");
    }

    return routeMap;
}

/**
 * Fix routes in every page and its content heading objects.
 * Without @page tags, documentalist produces empty heading routes,
 * so we reconstruct them from the page route and heading value.
 *
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 */
function fixPageRoutes(pages, routeMap) {
    for (const [ref, page] of Object.entries(pages)) {
        const correctRoute = routeMap.get(ref);
        if (correctRoute === undefined) {
            // Page not in nav config (e.g. _nav) — leave as-is
            continue;
        }

        page.route = correctRoute;

        // Extract page title from the first <h1> in contents.
        // With plain `#` headings (mdx), Documentalist renders them as HTML strings
        // instead of heading tag objects, so page.title is "(untitled)".
        if (page.title === "(untitled)") {
            for (const item of page.contents) {
                if (typeof item === "string") {
                    const h1Match = item.match(/<h1>(.*?)<\/h1>/);
                    if (h1Match) {
                        page.title = h1Match[1];
                        break;
                    }
                }
            }
        }

        // Reconstruct heading routes in page.contents
        for (const item of page.contents) {
            if (typeof item === "object" && item !== null && item.tag === "heading") {
                if (item.level === 1) {
                    // Level 1 heading = page title, route is the page route
                    item.route = correctRoute;
                } else {
                    // Level 2+ headings: pageRoute.slugified-heading-value
                    item.route = correctRoute + "." + slugify(item.value);
                }
            }
        }
    }
}

/**
 * Convert a heading value to a URL-friendly slug.
 * Matches documentalist's slugification: lowercase, replace non-[a-z0-9-] with hyphens.
 *
 * @param {string} value
 * @returns {string}
 */
function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

/**
 * Build the full nav tree from nav.json and page data.
 *
 * @param {Record<string, any[]>} navConfig
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @returns {any[]}
 */
function buildNavTree(navConfig, pages, routeMap) {
    return navConfig["_nav"].map(ref => buildPageNode(ref, 1, navConfig, pages, routeMap));
}

/**
 * Recursively build a PageNode for the nav tree.
 *
 * @param {string} ref
 * @param {number} level
 * @param {Record<string, any[]>} navConfig
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @returns {any}
 */
function buildPageNode(ref, level, navConfig, pages, routeMap) {
    const page = pages[ref];
    const route = routeMap.get(ref);
    const navChildren = navConfig[ref] || [];
    const hasHeadingMarkers = navChildren.some(c => typeof c === "object");

    // Extract heading children from page contents (level >= 2, i.e. not the @# title)
    const headingChildren = extractHeadingChildren(page, level);

    /** @type {any[]} */
    let children;

    if (hasHeadingMarkers) {
        // Interleaved mode: walk nav.json entries in order, matching heading markers
        // against page content headings by title
        const headingsByTitle = new Map();
        for (const h of headingChildren) {
            headingsByTitle.set(h.title, h);
        }

        children = [];
        for (const entry of navChildren) {
            if (typeof entry === "string") {
                children.push(buildPageNode(entry, level + 1, navConfig, pages, routeMap));
            } else if (entry.heading) {
                const matched = headingsByTitle.get(entry.heading);
                if (matched) {
                    children.push(matched);
                }
            }
        }
    } else {
        // Default mode: headings first, then page children
        const pageChildren = navChildren
            .filter(c => typeof c === "string")
            .map(childRef => buildPageNode(childRef, level + 1, navConfig, pages, routeMap));
        children = [...headingChildren, ...pageChildren];
    }

    return {
        children,
        level,
        reference: ref,
        route,
        title: page.title,
    };
}

/**
 * Extract heading nodes from page contents for the nav tree.
 * Skips level-1 headings (the page title). Adjusts heading levels
 * relative to the page's position in the nav tree.
 *
 * @param {any} page
 * @param {number} pageNavLevel
 * @returns {any[]}
 */
function extractHeadingChildren(page, pageNavLevel) {
    const levelOffset = pageNavLevel - 1;
    /** @type {any[]} */
    const result = [];

    for (const item of page.contents) {
        if (typeof item === "object" && item !== null && item.tag === "heading" && item.level >= 2) {
            result.push({
                title: item.value,
                level: item.level + levelOffset,
                route: item.route,
            });
        }
    }

    return result;
}
