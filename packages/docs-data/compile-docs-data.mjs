#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

// @ts-check

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { cwd } from "node:process";
import { globSync } from "node:fs";
import semver from "semver";

/** Library packages whose MDX docs are included in the docs site */
const LIBRARY_PACKAGES = ["core", "datetime", "icons", "select", "table", "labs"];

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

    generatePageRegistry(mdxFileMap, routeMap, allRefs);
    generateNpmVersions();

    console.info("[docs-data] successfully generated pageRegistry.ts and npmVersions.ts");
} catch (err) {
    console.error("[docs-data] ERROR:", err);
    process.exit(1);
}

/**
 * Discover all .mdx files across doc packages and build a map of filename stem -> file path.
 * Also indexes by package-prefixed stem for disambiguation (e.g. "table-features").
 *
 * @returns {{ stemMap: Map<string, string>, indexMap: Map<string, string> }} pageRef -> absolute file path
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

    // Merge: indexMap entries take precedence for package-level refs
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
// Page registry generation
// ---------------------------------------------------------------------------

/**
 * @param {{ stemMap: Map<string, string>, indexMap: Map<string, string> }} mdxFileMap
 * @param {Map<string, string>} routeMap
 * @param {Set<string>} allRefs
 */
function generatePageRegistry(mdxFileMap, routeMap, allRefs) {
    const entries = [];
    const warnings = [];

    for (const ref of allRefs) {
        const filePath = resolveRef(ref, mdxFileMap);
        if (!filePath) {
            warnings.push(`  WARNING: no MDX file found for nav ref "${ref}"`);
            continue;
        }

        const content = readFileSync(filePath, "utf-8");
        const headings = extractHeadings(content);
        const title = extractTitle(headings);
        const route = routeMap.get(ref) ?? ref;

        // Compute relative import path from docs-data/src/generated/ to the MDX file
        const importPath = relative(generatedSrcDir, filePath).replace(/\\/g, "/");
        // Source path relative to monorepo root (for "Edit this page" links)
        const sourcePath = relative(generatedSrcDir, filePath).replace(/\\/g, "/");

        // Only include h2+ headings (h1 is the page title)
        const subHeadings = headings
            .filter(h => h.level >= 2)
            .map(h => ({ title: h.title, slug: h.slug, level: h.level }));

        entries.push({ ref, title, route, importPath, sourcePath, headings: subHeadings });
    }

    for (const w of warnings) {
        console.warn(w);
    }

    // Generate TypeScript file
    const lines = [
        "// Auto-generated by compile-docs-data.mjs — do not edit",
        'import { lazy, type ComponentType, type LazyExoticComponent } from "react";',
        "",
        "export interface PageRegistryEntry {",
        "    component: LazyExoticComponent<ComponentType>;",
        "    title: string;",
        "    route: string;",
        "    sourcePath: string;",
        "    metadata: Record<string, unknown>;",
        "    headings: Array<{ title: string; slug: string; level: number }>;",
        "}",
        "",
        "export const pageRegistry: Record<string, PageRegistryEntry> = {",
    ];

    for (const entry of entries.sort((a, b) => a.ref.localeCompare(b.ref))) {
        lines.push(`    ${JSON.stringify(entry.ref)}: {`);
        lines.push(`        component: lazy(() => import(${JSON.stringify(entry.importPath)})),`);
        lines.push(`        title: ${JSON.stringify(entry.title)},`);
        lines.push(`        route: ${JSON.stringify(entry.route)},`);
        lines.push(`        sourcePath: ${JSON.stringify(entry.sourcePath)},`);
        lines.push(`        metadata: {},`);
        lines.push(`        headings: ${JSON.stringify(entry.headings)},`);
        lines.push(`    },`);
    }

    lines.push("};");
    lines.push("");

    writeFileSync(join(generatedSrcDir, "pageRegistry.ts"), lines.join("\n"));
    console.info(`[docs-data] generated pageRegistry.ts with ${entries.length} pages`);
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
        } catch (error) {
            console.warn(`[docs-data] failed to fetch npm versions for ${packageName}, using local version:`, error);
        }

        result[packageName] = {
            name: packageName,
            version: pkgJson.version,
            versions,
        };
    }

    writeFileSync(join(monorepoRootDir, "npm-data.json"), JSON.stringify(result, null, 2) + "\n");
    console.info("[docs-data] generated npm-data.json");
}
