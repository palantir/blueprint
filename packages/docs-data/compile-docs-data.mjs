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

/**
 * Applies the nav config to documentalist output: fixes page routes and
 * replaces the nav tree.
 *
 * @param {{ pages: Record<string, any>, nav: any[] }} docs
 * @param {import("./navTypes.d.ts").NavStructure} navConfig
 */
function applyNavConfig(docs, navConfig) {
    const routeMap = buildRouteMap(navConfig);
    fixPageRoutes(docs.pages, routeMap);
    docs.nav = buildNavTree(navConfig, docs.pages, routeMap);
}

/**
 * Walk the hierarchical nav config to compute the full route for every page reference.
 *
 * @param {import("./navTypes.d.ts").NavStructure} navConfig
 * @returns {Map<string, string>}
 */
function buildRouteMap(navConfig) {
    /** @type {Map<string, string>} */
    const routeMap = new Map();

    /**
     * @param {string} ref
     * @param {string} parentRoute
     */
    function addRoute(ref, parentRoute) {
        const route = parentRoute ? `${parentRoute}/${ref}` : ref;
        if (routeMap.has(ref)) {
            console.warn(`[docs-data] duplicate nav ref "${ref}" (route "${route}" overwrites "${routeMap.get(ref)}")`);
        }
        routeMap.set(ref, route);
        return route;
    }

    for (const entry of navConfig) {
        const packageRoute = addRoute(entry.package, "");

        for (const pageRef of entry.pages) {
            addRoute(pageRef, packageRoute);
        }

        for (const section of entry.sections ?? []) {
            const sectionRoute = addRoute(section.section, packageRoute);

            for (const child of section.children) {
                if (typeof child === "string") {
                    addRoute(child, sectionRoute);
                } else {
                    // NavHeadingGroup — pages within the group share the section route
                    for (const pageRef of child.pages) {
                        addRoute(pageRef, sectionRoute);
                    }
                }
            }
        }
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
 * Hand-rolled to match documentalist's slugification: lowercase, replace non-[a-z0-9-] with hyphens.
 * N.B. this does not collapse consecutive hyphens or trim edges — keep in sync if documentalist changes.
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
 * @param {import("./navTypes.d.ts").NavStructure} navConfig
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @returns {any[]}
 */
function buildNavTree(navConfig, pages, routeMap) {
    return navConfig.map(entry => {
        const packageChildren = [
            ...entry.pages.map(ref => buildLeafPageNode(ref, 2, pages, routeMap)),
            ...(entry.sections ?? []).map(section => buildSectionNode(section, 2, pages, routeMap)),
        ];
        return buildPageNodeFromChildren(entry.package, 1, pages, routeMap, packageChildren);
    });
}

/**
 * Build a PageNode for a section, which may contain bare pages and heading groups.
 *
 * @param {import("./navTypes.d.ts").NavSection} section
 * @param {number} level
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @returns {any}
 */
function buildSectionNode(section, level, pages, routeMap) {
    const childLevel = level + 1;
    const page = pages[section.section];
    const headingsByTitle = new Map();
    for (const h of extractHeadingChildren(page, level)) {
        headingsByTitle.set(h.title, h);
    }

    /** @type {any[]} */
    const children = [];
    for (const child of section.children) {
        if (typeof child === "string") {
            children.push(buildLeafPageNode(child, childLevel, pages, routeMap));
        } else {
            // NavHeadingGroup — emit the heading node, then its pages
            const matched = headingsByTitle.get(child.heading);
            if (matched) {
                children.push(matched);
            } else {
                console.warn(`[docs-data] nav.json heading "${child.heading}" not found in page "${section.section}" contents`);
            }
            for (const pageRef of child.pages) {
                children.push(buildLeafPageNode(pageRef, childLevel, pages, routeMap));
            }
        }
    }

    return buildPageNodeFromChildren(section.section, level, pages, routeMap, children);
}

/**
 * Build a PageNode for a leaf page (no nav children, only content headings).
 *
 * @param {string} ref
 * @param {number} level
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @returns {any}
 */
function buildLeafPageNode(ref, level, pages, routeMap) {
    const headingChildren = extractHeadingChildren(requirePage(ref, pages), level);
    return buildPageNodeFromChildren(ref, level, pages, routeMap, headingChildren);
}

/**
 * Assemble a PageNode from a ref and pre-built children array.
 *
 * @param {string} ref
 * @param {number} level
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @param {any[]} children
 * @returns {any}
 */
function buildPageNodeFromChildren(ref, level, pages, routeMap, children) {
    const page = requirePage(ref, pages);
    return {
        children,
        level,
        reference: ref,
        route: routeMap.get(ref),
        title: page.title,
    };
}

/**
 * Look up a page by reference, throwing if not found.
 *
 * @param {string} ref
 * @param {Record<string, any>} pages
 * @returns {any}
 */
function requirePage(ref, pages) {
    const page = pages[ref];
    if (page === undefined) {
        throw new Error(`[docs-data] nav.json references page "${ref}" which does not exist in docs.pages`);
    }
    return page;
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
