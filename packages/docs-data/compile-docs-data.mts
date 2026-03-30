#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

import { existsSync, globSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { cwd } from "node:process";
import semver from "semver";

/** Library packages whose docs are included in the docs site */
const LIBRARY_PACKAGES = ["core", "datetime", "datetime2", "icons", "select", "table", "labs"];

/** Packages with MDX documentation files */
const ALL_DOC_PACKAGES = [...LIBRARY_PACKAGES, "docs-app"];

const monorepoRootDir = resolve(cwd(), "../../");
const generatedSrcDir = resolve(cwd(), "./src/generated");
const navConfigPath = new URL("./nav.json", import.meta.url);

try {
    if (!existsSync(generatedSrcDir)) {
        mkdirSync(generatedSrcDir, { recursive: true });
    }

    const navConfig = JSON.parse(readFileSync(navConfigPath, "utf-8"));
    const mdxFileMap = discoverMdxFiles();
    const routeMap = buildRouteMap(navConfig);
    const allRefs = collectAllRefs(navConfig);

    // Build page data (headings, titles, file paths) for all refs
    const pageData = buildPageData(mdxFileMap, routeMap, allRefs);

    generatePageRegistry(pageData);
    generateNavTree(navConfig, pageData, routeMap);
    generateDocsData();
    await generateNpmVersions();

    console.info("[docs-data] successfully generated pageRegistry.ts, navTree.ts, docsData.ts, and npm data");
} catch (err) {
    console.error("[docs-data] ERROR:", err);
    process.exit(1);
}

// ---------------------------------------------------------------------------
// MDX file discovery
// ---------------------------------------------------------------------------

/**
 * Discover all .mdx files across doc packages and build a map of filename stem -> file path.
 * Also indexes by package-prefixed stem for disambiguation (e.g. "table-features").
 *
 * @returns {{ stemMap: Map<string, string>, indexMap: Map<string, string> }}
 */
function discoverMdxFiles() {
    /** @type {Map<string, string>} stem -> absolute path */
    const stemMap = new Map();
    /** @type {Map<string, string>} package/stem or special -> absolute path */
    const indexMap = new Map();

    for (const pkg of ALL_DOC_PACKAGES) {
        const pkgSrcDir = resolve(monorepoRootDir, "packages", pkg, "src");
        const pattern = join(pkgSrcDir, "**/*.mdx");
        const files = globSync(pattern);

        for (const filePath of files) {
            const stem = basename(filePath, ".mdx");

            // index.mdx files map to the package name
            if (stem === "index") {
                indexMap.set(pkg, filePath);
            } else {
                // First match wins for bare stem
                if (!stemMap.has(stem)) {
                    stemMap.set(stem, filePath);
                }
                // Also store package-prefixed version for disambiguation
                indexMap.set(`${pkg}/${stem}`, filePath);
            }
        }
    }

    return { stemMap, indexMap };
}

/**
 * Resolve a nav page reference to an MDX file path.
 *
 * @param {string} ref
 * @param {{ stemMap: Map<string, string>, indexMap: Map<string, string> }} mdxFileMap
 * @returns {string | undefined}
 */
function resolveRef(ref, mdxFileMap) {
    const { stemMap, indexMap } = mdxFileMap;

    // 1. Direct stem match (covers most cases: "alert" -> alert.mdx)
    if (stemMap.has(ref)) {
        return stemMap.get(ref);
    }

    // 2. Package index match (covers "core" -> core/src/docs/index.mdx)
    if (indexMap.has(ref)) {
        return indexMap.get(ref);
    }

    // 3. Try package-prefixed stems for ambiguous refs like "features" -> "table/table-features"
    for (const pkg of ALL_DOC_PACKAGES) {
        const prefixed = `${pkg}/${pkg}-${ref}`;
        if (indexMap.has(prefixed)) {
            return indexMap.get(prefixed);
        }
    }

    return undefined;
}

// ---------------------------------------------------------------------------
// Route map
// ---------------------------------------------------------------------------

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
 * Collect all page references from nav config (flat set).
 *
 * @param {Record<string, any[]>} navConfig
 * @returns {Set<string>}
 */
function collectAllRefs(navConfig) {
    /** @type {Set<string>} */
    const refs = new Set(navConfig["_nav"]);
    for (const [key, children] of Object.entries(navConfig)) {
        if (key === "_nav") continue;
        for (const child of children) {
            if (typeof child === "string") {
                refs.add(child);
            }
        }
    }
    return refs;
}

// ---------------------------------------------------------------------------
// Heading extraction from MDX source
// ---------------------------------------------------------------------------

/**
 * Convert a heading value to a URL-friendly slug.
 *
 * @param {string} value
 * @returns {string}
 */
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

/**
 * Extract headings from raw MDX content.
 *
 * @param {string} content
 * @returns {Array<{ title: string, slug: string, level: number }>}
 */
function extractHeadings(content) {
    /** @type {Array<{ title: string, slug: string, level: number }>} */
    const headings = [];
    for (const line of content.split("\n")) {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const title = match[2].trim();
            headings.push({ title, slug: slugify(title), level });
        }
    }
    return headings;
}

/**
 * Extract page title from headings (first h1, or first heading).
 *
 * @param {Array<{ title: string, slug: string, level: number }>} headings
 * @returns {string}
 */
function extractTitle(headings) {
    const h1 = headings.find(h => h.level === 1);
    return h1 ? h1.title : (headings[0]?.title ?? "(untitled)");
}

// ---------------------------------------------------------------------------
// Page data: build a map of ref -> { title, headings, filePath, route }
// ---------------------------------------------------------------------------

/**
 * @typedef {{
 *   ref: string,
 *   title: string,
 *   route: string,
 *   filePath: string,
 *   importPath: string,
 *   sourcePath: string,
 *   headings: Array<{ title: string, slug: string, level: number }>,
 * }} PageInfo
 */

/**
 * Build page data for all nav refs.
 *
 * @param {{ stemMap: Map<string, string>, indexMap: Map<string, string> }} mdxFileMap
 * @param {Map<string, string>} routeMap
 * @param {Set<string>} allRefs
 * @returns {Map<string, PageInfo>}
 */
function buildPageData(mdxFileMap, routeMap, allRefs) {
    /** @type {Map<string, PageInfo>} */
    const pageData = new Map();

    for (const ref of allRefs) {
        const filePath = resolveRef(ref, mdxFileMap);
        if (!filePath) {
            console.warn(`  WARNING: no MDX file found for nav ref "${ref}"`);
            continue;
        }

        const content = readFileSync(filePath, "utf-8");
        const headings = extractHeadings(content);
        const title = extractTitle(headings);
        const route = routeMap.get(ref) ?? ref;

        // Compute relative import path from docs-data/src/generated/ to the MDX file
        const importPath = relative(generatedSrcDir, filePath).replace(/\\/g, "/");
        // Source path relative to monorepo root (for "Edit this page" links)
        const sourcePath = relative(monorepoRootDir, filePath).replace(/\\/g, "/");

        pageData.set(ref, { ref, title, route, filePath, importPath, sourcePath, headings });
    }

    return pageData;
}

// ---------------------------------------------------------------------------
// Page registry generation
// ---------------------------------------------------------------------------

/**
 * @param {Map<string, PageInfo>} pageData
 */
function generatePageRegistry(pageData) {
    const entries = [...pageData.values()].sort((a, b) => a.ref.localeCompare(b.ref));

    const lines = [
        "// Auto-generated by compile-docs-data.mts — do not edit",
        'import { lazy } from "react";',
        "",
        'import type { PageRegistryEntry } from "@blueprintjs/docs-data";',
        "",
        "export const pageRegistry: Record<string, PageRegistryEntry> = {",
    ];

    for (const entry of entries) {
        // Only include h2+ headings in pageRegistry (h1 is the page title)
        const subHeadings = entry.headings.filter(h => h.level >= 2);

        lines.push(`    ${JSON.stringify(entry.ref)}: {`);
        lines.push(`        component: lazy(() => import(${JSON.stringify(entry.importPath)})),`);
        lines.push(`        title: ${JSON.stringify(entry.title)},`);
        lines.push(`        route: ${JSON.stringify(entry.route)},`);
        lines.push(`        sourcePath: ${JSON.stringify(entry.sourcePath)},`);
        lines.push(`        metadata: {},`);
        lines.push(`        headings: ${JSON.stringify(subHeadings)},`);
        lines.push(`    },`);
    }

    lines.push("};");
    lines.push("");

    writeFileSync(join(generatedSrcDir, "pageRegistry.ts"), lines.join("\n"));
    console.info(`[docs-data] generated pageRegistry.ts with ${entries.length} pages`);
}

// ---------------------------------------------------------------------------
// Nav tree generation
// ---------------------------------------------------------------------------

/**
 * Build the full nav tree from nav.json and page data, then write it as a generated file.
 *
 * @param {Record<string, any[]>} navConfig
 * @param {Map<string, PageInfo>} pageData
 * @param {Map<string, string>} routeMap
 */
function generateNavTree(navConfig, pageData, routeMap) {
    const tree = navConfig["_nav"].map(ref => buildPageNode(ref, 1, navConfig, pageData, routeMap));

    const lines = [
        "// Auto-generated by compile-docs-data.mts — do not edit",
        'import type { HeadingNode, PageNode } from "@blueprintjs/docs-data";',
        "",
        `export const navTree: Array<PageNode | HeadingNode> = ${JSON.stringify(tree, null, 4)};`,
        "",
    ];

    writeFileSync(join(generatedSrcDir, "navTree.ts"), lines.join("\n"));
    console.info(`[docs-data] generated navTree.ts`);
}

/**
 * Recursively build a PageNode for the nav tree.
 *
 * @param {string} ref
 * @param {number} level
 * @param {Record<string, any[]>} navConfig
 * @param {Map<string, PageInfo>} pageData
 * @param {Map<string, string>} routeMap
 * @returns {any}
 */
function buildPageNode(ref, level, navConfig, pageData, routeMap) {
    const page = pageData.get(ref);
    const route = routeMap.get(ref) ?? ref;
    const navChildren = navConfig[ref] || [];
    const hasHeadingMarkers = navChildren.some(c => typeof c === "object");

    const title = page?.title ?? ref;

    // Extract heading children from page headings (level >= 2, i.e. not the # title)
    const headingChildren = extractHeadingChildren(page, route, level);

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
                children.push(buildPageNode(entry, level + 1, navConfig, pageData, routeMap));
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
            .map(childRef => buildPageNode(childRef, level + 1, navConfig, pageData, routeMap));
        children = [...headingChildren, ...pageChildren];
    }

    return {
        children,
        level,
        reference: ref,
        route,
        title,
    };
}

/**
 * Extract heading nodes from page data for the nav tree.
 * Skips level-1 headings (the page title). Adjusts heading levels
 * relative to the page's position in the nav tree.
 *
 * @param {PageInfo | undefined} page
 * @param {string} pageRoute
 * @param {number} pageNavLevel
 * @returns {any[]}
 */
function extractHeadingChildren(page, pageRoute, pageNavLevel) {
    if (page == null) {
        return [];
    }

    const levelOffset = pageNavLevel - 1;
    /** @type {any[]} */
    const result = [];

    for (const heading of page.headings) {
        if (heading.level >= 2) {
            result.push({
                title: heading.title,
                level: heading.level + levelOffset,
                route: pageRoute + "." + heading.slug,
            });
        }
    }

    return result;
}

// ---------------------------------------------------------------------------
// docsData assembly (replaces docs.json)
// ---------------------------------------------------------------------------

/**
 * Generate a docsData.ts file that assembles nav + pages + npm into the
 * DocsData shape consumed by the Documentation component.
 */
function generateDocsData() {
    const lines = [
        "// Auto-generated by compile-docs-data.mts — do not edit",
        'import type { DocsCompleteData } from "@blueprintjs/docs-data";',
        "",
        'import { navTree } from "./navTree";',
        'import npmData from "./npm-data.json";',
        'import { pageRegistry } from "./pageRegistry";',
        "",
        "export const docsData: DocsCompleteData = {",
        "    nav: navTree,",
        "    pages: pageRegistry,",
        "    npm: npmData,",
        "};",
        "",
    ];

    writeFileSync(join(generatedSrcDir, "docsData.ts"), lines.join("\n"));
    console.info("[docs-data] generated docsData.ts");
}

// ---------------------------------------------------------------------------
// NPM version data generation
// ---------------------------------------------------------------------------

async function generateNpmVersions() {
    /** @type {Record<string, { name: string; version: string; versions: string[] }>} */
    const result = {};

    for (const pkg of LIBRARY_PACKAGES) {
        const pkgJsonPath = resolve(monorepoRootDir, "packages", pkg, "package.json");
        if (!existsSync(pkgJsonPath)) continue;

        const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
        const packageName = pkgJson.name;

        let versions = [pkgJson.version];
        try {
            const response = await fetch(`https://registry.npmjs.org/${packageName}`);
            if (response.ok) {
                const data = await response.json();
                const allVersions = Object.keys(data.versions);
                // keep one (latest) version per major, sorted descending
                const majors = new Map();
                for (const v of allVersions) {
                    const maj = semver.major(v);
                    if (maj === 0) continue;
                    if (!majors.has(maj) || semver.gt(v, majors.get(maj))) {
                        majors.set(maj, v);
                    }
                }
                versions = Array.from(majors.values()).sort((a, b) => semver.rcompare(a, b));
            } else {
                console.warn(
                    `[docs-data] npm registry returned ${response.status} for ${packageName}, using local version`,
                );
            }
        } catch (e) {
            console.warn(
                `[docs-data] failed to fetch npm versions for ${packageName}, using local version:`,
                e.message,
            );
        }

        result[packageName] = {
            name: packageName,
            version: pkgJson.version,
            versions,
        };
    }

    writeFileSync(join(generatedSrcDir, "npm-data.json"), JSON.stringify(result, null, 2) + "\n");
    console.info("[docs-data] generated npm-data.json");

    // Also generate typed npmVersions.ts
    const tsLines = [
        "// Auto-generated by compile-docs-data.mts — do not edit",
        'import type { NpmPackageInfo } from "@blueprintjs/docs-data";',
        "",
        `export const npmVersions: Record<string, NpmPackageInfo> = ${JSON.stringify(result, null, 4)};`,
        "",
    ];

    writeFileSync(join(generatedSrcDir, "npmVersions.ts"), tsLines.join("\n"));
    console.info("[docs-data] generated npmVersions.ts");
}
