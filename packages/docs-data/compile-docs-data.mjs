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

/** Library packages whose .mdx files are scanned */
const LIBRARY_PACKAGES = ["core", "datetime", "datetime2", "icons", "select", "table", "labs"];

/** This package is expected to have the markdown "navPage" */
const DOCS_PACKAGE = "docs-app";

/** All packages containing .mdx documentation */
const LIBRARY_AND_DOCS_PACKAGES = [...LIBRARY_PACKAGES, DOCS_PACKAGE];

console.info(`[docs-data] compiling documentation for library packages: ${LIBRARY_PACKAGES.join(", ")}`);

// assume we are running from packages/docs-data
const monorepoRootDir = resolve(cwd(), "../../");
const generatedSrcDir = resolve(cwd(), "./src/generated");

try {
    if (!existsSync(generatedSrcDir)) {
        mkdirSync(generatedSrcDir, { recursive: true });
    }
    generatePageRegistry();
    await generateNpmVersions();
} catch (err) {
    console.error("[docs-data] ERROR:", err);
    process.exit(1);
}

console.info(`[docs-data] successfully generated pageRegistry.ts and npmVersions.ts`);

// ---------------------------------------------------------------------------
// MDX file discovery
// ---------------------------------------------------------------------------

/**
 * Discover all .mdx files across the documentation packages.
 * Returns two maps for resolving nav refs to file paths:
 *   stemMap:  file stem (without .mdx extension) → absolute path
 *   indexMap: parent directory name → absolute path (for index.mdx files)
 *
 * For files whose stem is prefixed with a package name (e.g. table-api.mdx in the table package),
 * an additional entry is added with the prefix stripped (e.g. "api" → path).
 *
 * @returns {{ stemMap: Map<string, string>, indexMap: Map<string, string> }}
 */
function discoverMdxFiles() {
    /** @type {Map<string, string>} */
    const stemMap = new Map();
    /** @type {Map<string, string>} */
    const indexMap = new Map();

    for (const pkg of LIBRARY_AND_DOCS_PACKAGES) {
        const pkgDir = resolve(monorepoRootDir, "packages", pkg);
        const pattern = join(pkgDir, "src/**/*.mdx");
        const files = globSync(pattern);

        for (const absPath of files) {
            const stem = basename(absPath, ".mdx");

            if (stem === "index") {
                // index.mdx → map parent dir name (or package name for top-level src/index.mdx)
                const relFromSrc = relative(join(pkgDir, "src"), absPath);
                const parts = relFromSrc.split("/");
                if (parts.length === 1) {
                    // src/index.mdx → use package name
                    indexMap.set(pkg, absPath);
                } else {
                    // src/.../index.mdx → use parent dir name
                    const dirName = parts[parts.length - 2];
                    indexMap.set(dirName, absPath);
                    // Also register under package name if parent dir is "docs"
                    // (e.g. core/src/docs/index.mdx → "core")
                    if (dirName === "docs") {
                        indexMap.set(pkg, absPath);
                    }
                }
            } else {
                stemMap.set(stem, absPath);

                // If stem is prefixed with the package name, also register without prefix
                // e.g. "table-api" in package "table" → also register "api"
                if (stem.startsWith(pkg + "-")) {
                    const stripped = stem.slice(pkg.length + 1);
                    if (!stemMap.has(stripped)) {
                        stemMap.set(stripped, absPath);
                    }
                }
            }
        }
    }

    return { stemMap, indexMap };
}

/**
 * Resolve a nav reference to an absolute .mdx file path.
 *
 * @param {string} ref
 * @param {{ stemMap: Map<string, string>, indexMap: Map<string, string> }} mdxFileMap
 * @returns {string | undefined}
 */
function resolveRef(ref, mdxFileMap) {
    return mdxFileMap.stemMap.get(ref) ?? mdxFileMap.indexMap.get(ref);
}

// ---------------------------------------------------------------------------
// Collect all page references from nav.json
// ---------------------------------------------------------------------------

/**
 * Walk nav.json and collect every page reference (strings only, not heading markers).
 *
 * @param {Record<string, any>} navConfig
 * @returns {string[]}
 */
function collectAllRefs(navConfig) {
    /** @type {Set<string>} */
    const refs = new Set();

    /**
     * @param {string} ref
     */
    function walk(ref) {
        refs.add(ref);
        const children = navConfig[ref];
        if (children) {
            for (const child of children) {
                if (typeof child === "string") {
                    walk(child);
                }
            }
        }
    }

    for (const ref of navConfig["_nav"]) {
        walk(ref);
    }

    return Array.from(refs);
}

// ---------------------------------------------------------------------------
// Route map (reused from previous version)
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
            }
        }
    }

    for (const ref of navConfig["_nav"]) {
        walk(ref, "");
    }

    return routeMap;
}

// ---------------------------------------------------------------------------
// Heading extraction from MDX source
// ---------------------------------------------------------------------------

/**
 * Extract markdown headings from MDX source content.
 * Only extracts lines that start with # (ignoring code blocks).
 *
 * @param {string} content
 * @returns {Array<{ title: string; slug: string; level: number }>}
 */
function extractHeadings(content) {
    /** @type {Array<{ title: string; slug: string; level: number }>} */
    const headings = [];
    let inCodeBlock = false;

    for (const line of content.split("\n")) {
        if (line.startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;

        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const title = match[2].trim();
            const slug = slugify(title);
            headings.push({ title, slug, level });
        }
    }

    return headings;
}

/**
 * Extract frontmatter metadata from MDX source.
 *
 * @param {string} content
 * @returns {{ metadata: Record<string, unknown>, body: string }}
 */
function extractFrontmatter(content) {
    if (!content.startsWith("---")) {
        return { metadata: {}, body: content };
    }

    const endIndex = content.indexOf("---", 3);
    if (endIndex === -1) {
        return { metadata: {}, body: content };
    }

    const frontmatter = content.slice(3, endIndex).trim();
    /** @type {Record<string, unknown>} */
    const metadata = {};
    for (const line of frontmatter.split("\n")) {
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0) {
            const key = line.slice(0, colonIdx).trim();
            const value = line.slice(colonIdx + 1).trim();
            metadata[key] = value;
        }
    }

    return { metadata, body: content.slice(endIndex + 3) };
}

/**
 * Extract the page title from headings (first h1, or first heading of any level).
 *
 * @param {Array<{ title: string; level: number }>} headings
 * @returns {string}
 */
function extractTitle(headings) {
    const h1 = headings.find(h => h.level === 1);
    if (h1) return h1.title;
    return headings.length > 0 ? headings[0].title : "(untitled)";
}

/**
 * Convert a heading value to a URL-friendly slug.
 *
 * @param {string} value
 * @returns {string}
 */
function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

// ---------------------------------------------------------------------------
// Page registry generation
// ---------------------------------------------------------------------------

function generatePageRegistry() {
    const navConfig = JSON.parse(readFileSync(new URL("./nav.json", import.meta.url), "utf-8"));
    const allRefs = collectAllRefs(navConfig);
    const routeMap = buildRouteMap(navConfig);
    const mdxFileMap = discoverMdxFiles();

    /** @type {string[]} */
    const entries = [];

    for (const ref of allRefs) {
        const absPath = resolveRef(ref, mdxFileMap);
        if (!absPath) {
            console.warn(`[docs-data] WARNING: no .mdx file found for nav ref "${ref}"`);
            continue;
        }

        const route = routeMap.get(ref) ?? ref;
        const relPathFromGenerated = relative(generatedSrcDir, absPath).replace(/\\/g, "/");
        const content = readFileSync(absPath, "utf-8");
        const { metadata } = extractFrontmatter(content);
        const headings = extractHeadings(content);
        const title = extractTitle(headings);

        entries.push(
            `    ${JSON.stringify(ref)}: {\n` +
                `        component: lazy(() => import(${JSON.stringify(relPathFromGenerated)})),\n` +
                `        title: ${JSON.stringify(title)},\n` +
                `        route: ${JSON.stringify(route)},\n` +
                `        sourcePath: ${JSON.stringify(relPathFromGenerated)},\n` +
                `        metadata: ${JSON.stringify(metadata)},\n` +
                `        headings: ${JSON.stringify(headings)},\n` +
                `    }`,
        );
    }

    const output =
        `// Auto-generated by compile-docs-data.mjs — do not edit\n` +
        `import { lazy } from "react";\n` +
        `\n` +
        `import type { PageRegistryEntry } from "../types";\n` +
        `\n` +
        `export const pageRegistry: Record<string, PageRegistryEntry> = {\n` +
        entries.join(",\n") +
        ",\n" +
        `};\n`;

    writeFileSync(join(generatedSrcDir, "pageRegistry.ts"), output);
    console.info(`[docs-data] generated pageRegistry.ts (${entries.length} pages)`);
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

    const output =
        `// Auto-generated by compile-docs-data.mjs — do not edit\n` +
        `import type { NpmPackageInfo } from "../types";\n` +
        `\n` +
        `export const npmVersions: Record<string, NpmPackageInfo> = ${JSON.stringify(result, null, 4)};\n`;

    writeFileSync(join(generatedSrcDir, "npmVersions.ts"), output);
    console.info("[docs-data] generated npmVersions.ts");
}
