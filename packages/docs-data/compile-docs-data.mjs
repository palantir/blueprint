#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

// @ts-check

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { cwd } from "node:process";
import { globSync } from "node:fs";
import * as docgen from "react-docgen-typescript";
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
    generatePropsRegistry();
    await generateNpmVersions();
} catch (err) {
    console.error("[docs-data] ERROR:", err);
    process.exit(1);
}

console.info(`[docs-data] successfully generated pageRegistry.ts, propsRegistry.ts, and npmVersions.ts`);

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
            `    }`
        );
    }

    const output =
        `// Auto-generated by compile-docs-data.mjs — do not edit\n` +
        `import { lazy } from "react";\n` +
        `\n` +
        `import type { PageRegistryEntry } from "../types";\n` +
        `\n` +
        `export const pageRegistry: Record<string, PageRegistryEntry> = {\n` +
        entries.join(",\n") + ",\n" +
        `};\n`;

    writeFileSync(join(generatedSrcDir, "pageRegistry.ts"), output);
    console.info(`[docs-data] generated pageRegistry.ts (${entries.length} pages)`);
}

// ---------------------------------------------------------------------------
// Props registry generation (react-docgen-typescript)
// ---------------------------------------------------------------------------

/**
 * Resolve the tsconfig path for a given library package.
 * Core uses tsconfig.build.json (its tsconfig.json is a project-reference file).
 * All other packages use tsconfig.json directly.
 *
 * @param {string} pkg
 * @returns {string}
 */
function resolveTsconfigForPackage(pkg) {
    const srcDir = resolve(monorepoRootDir, "packages", pkg, "src");
    const buildConfig = join(srcDir, "tsconfig.build.json");
    if (existsSync(buildConfig)) {
        return buildConfig;
    }
    return join(srcDir, "tsconfig.json");
}

/**
 * Normalize a single prop from react-docgen-typescript output into our PropInfo shape.
 *
 * @param {import("react-docgen-typescript").PropItem} prop
 * @returns {{ name: string, required: boolean, type: string, defaultValue: string | null, description: string, deprecated: boolean | string, internal: boolean, parentName: string | null }}
 */
function normalizeProp(prop) {
    let description = prop.description || "";
    let deprecated = false;
    let internal = false;

    // Detect @deprecated tag in description
    const deprecatedMatch = description.match(/@deprecated\s*(.*)/i);
    if (deprecatedMatch) {
        const msg = deprecatedMatch[1].trim();
        deprecated = msg || true;
        description = description.replace(/@deprecated\s*.*/i, "").trim();
    }

    // Detect @internal tag in description
    if (/@internal/i.test(description)) {
        internal = true;
        description = description.replace(/@internal\s*/gi, "").trim();
    }

    // Normalize type: prefer raw for enums (shows "Intent | undefined" instead of "enum")
    let typeName = prop.type?.name || "unknown";
    if (typeName === "enum" && prop.type?.raw) {
        typeName = prop.type.raw;
    }

    return {
        name: prop.name,
        required: prop.required,
        type: typeName,
        defaultValue: prop.defaultValue?.value ?? null,
        description,
        deprecated,
        internal,
        parentName: prop.parent?.name ?? null,
    };
}

/**
 * Determine the primary props interface name for a component.
 * Prefers a parent name matching "${displayName}Props", otherwise picks the
 * most common non-node_modules parent name.
 *
 * @param {import("react-docgen-typescript").ComponentDoc} doc
 * @returns {string}
 */
function detectPrimaryInterface(doc) {
    /** @type {Map<string, number>} */
    const parentCounts = new Map();
    for (const prop of Object.values(doc.props)) {
        const name = prop.parent?.name;
        if (name) {
            parentCounts.set(name, (parentCounts.get(name) || 0) + 1);
        }
    }

    const expected = doc.displayName + "Props";
    if (parentCounts.has(expected)) {
        return expected;
    }

    // Fall back to the most common parent interface name
    let best = expected;
    let bestCount = 0;
    for (const [name, count] of parentCounts) {
        if (count > bestCount) {
            best = name;
            bestCount = count;
        }
    }
    return best;
}

function generatePropsRegistry() {
    /** @type {Record<string, { name: string, description: string, filePath: string, props: ReturnType<typeof normalizeProp>[] }>} */
    const registry = {};

    for (const pkg of LIBRARY_PACKAGES) {
        const tsconfigPath = resolveTsconfigForPackage(pkg);
        if (!existsSync(tsconfigPath)) {
            console.warn(`[docs-data] WARNING: no tsconfig found for package "${pkg}" at ${tsconfigPath}`);
            continue;
        }

        const parser = docgen.withCustomConfig(tsconfigPath, {
            savePropValueAsString: true,
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: prop => {
                // Filter out props declared only in node_modules (React HTML attrs, etc.)
                if (prop.declarations && prop.declarations.length > 0) {
                    return prop.declarations.some(d => !d.fileName.includes("node_modules"));
                }
                return true;
            },
        });

        // Discover .tsx files, excluding tests and examples
        const pkgSrcDir = resolve(monorepoRootDir, "packages", pkg, "src");
        const tsxFiles = globSync(join(pkgSrcDir, "**/*.tsx")).filter(f => {
            const rel = relative(pkgSrcDir, f);
            return !(
                rel.includes("/test/") ||
                rel.includes("/__tests__/") ||
                rel.includes("/examples/") ||
                rel.includes("/_examples/") ||
                rel.endsWith(".test.tsx") ||
                rel.endsWith(".test.ts") ||
                rel.endsWith(".mdx")
            );
        });

        console.info(`[docs-data]   parsing ${tsxFiles.length} .tsx files in ${pkg}...`);

        for (const filePath of tsxFiles) {
            let docs;
            try {
                docs = parser.parse(filePath);
            } catch (err) {
                console.warn(`[docs-data] WARNING: failed to parse ${relative(monorepoRootDir, filePath)}: ${err.message}`);
                continue;
            }

            for (const doc of docs) {
                if (Object.keys(doc.props).length === 0) continue;

                const primaryName = detectPrimaryInterface(doc);
                const allNormalized = Object.values(doc.props).map(normalizeProp);

                // Register the full flattened set under the primary interface name
                if (!registry[primaryName]) {
                    registry[primaryName] = {
                        name: primaryName,
                        description: doc.description || "",
                        filePath: relative(monorepoRootDir, doc.filePath),
                        props: allNormalized.sort((a, b) => a.name.localeCompare(b.name)),
                    };
                }

                // Also register sub-interfaces (per unique parentName) with only their declared props
                /** @type {Map<string, ReturnType<typeof normalizeProp>[]>} */
                const byParent = new Map();
                for (const prop of allNormalized) {
                    const parent = prop.parentName || primaryName;
                    if (!byParent.has(parent)) byParent.set(parent, []);
                    byParent.get(parent).push(prop);
                }

                for (const [ifaceName, props] of byParent) {
                    if (ifaceName === primaryName) continue; // already registered
                    if (registry[ifaceName]) continue; // first registration wins

                    // Find the file path for this sub-interface
                    const sample = Object.values(doc.props).find(p => p.parent?.name === ifaceName);
                    const ifaceFilePath = sample?.parent?.fileName
                        ? relative(monorepoRootDir, sample.parent.fileName)
                        : relative(monorepoRootDir, doc.filePath);

                    registry[ifaceName] = {
                        name: ifaceName,
                        description: "",
                        filePath: ifaceFilePath,
                        props: props.sort((a, b) => a.name.localeCompare(b.name)),
                    };
                }
            }
        }

        console.info(`[docs-data]   ${pkg}: registry now has ${Object.keys(registry).length} interfaces`);
    }

    const output =
        `// Auto-generated by compile-docs-data.mjs — do not edit\n` +
        `import type { PropsRegistry } from "../types";\n` +
        `\n` +
        `export const propsRegistry: PropsRegistry = ${JSON.stringify(registry, null, 4)};\n`;

    writeFileSync(join(generatedSrcDir, "propsRegistry.ts"), output);
    console.info(`[docs-data] generated propsRegistry.ts (${Object.keys(registry).length} interfaces)`);
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
                console.warn(`[docs-data] npm registry returned ${response.status} for ${packageName}, using local version`);
            }
        } catch (e) {
            console.warn(`[docs-data] failed to fetch npm versions for ${packageName}, using local version:`, e.message);
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
