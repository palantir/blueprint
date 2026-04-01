#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates data for packages/docs-app
 */

import { Documentalist, KssPlugin, TypescriptPlugin } from "@documentalist/compiler";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { cwd } from "node:process";
import { glob } from "glob";
import grayMatter from "gray-matter";
import packageJson from "package-json";
import semver from "semver";

import { Classes } from "@blueprintjs/core";

import { assignRoutes, buildNavTree, getPageRefs, normalizeNavConfig } from "./navHelpers.mts";
import {
    PACKAGES,
    SECTIONS,
    type DocContentItem,
    type DocPage,
    type NavStructure,
    type NavTreeNode,
    type RawNavStructure,
} from "./navTypes.mts";

/** Run Documentalist on Sass, TypeScript, and package.json files in these packages */
export const LIBRARY_PACKAGES = ["core", "datetime", "datetime2", "icons", "select", "table", "labs"];

/** This package is expected to have the markdown "navPage" */
const DOCS_PACKAGE = "docs-app";

/** Run Documentalist on Markdown files in these packages */
const LIBRARY_AND_DOCS_PACKAGES = [...LIBRARY_PACKAGES, DOCS_PACKAGE];

console.info(`[docs-data] compiling documentation for library packages: ${LIBRARY_PACKAGES.join(", ")}`);

// assume we are running from packages/docs-app
const monorepoRootDir = resolve(cwd(), "../../");
const generatedSrcDir = resolve(cwd(), "./src/generated");
const docsDataFilePath = join(generatedSrcDir, "docs.json");

// The docs-app generated dir lives next to us in the monorepo
const docsAppGeneratedDir = resolve(monorepoRootDir, "packages/docs-app/src/generated");

/** Regex for markdown headings (# through ###). */
const HEADING_RE = /^(#{1,3})\s+(.+)$/gm;

try {
    if (!existsSync(generatedSrcDir)) {
        mkdirSync(generatedSrcDir);
    }
    if (!existsSync(docsAppGeneratedDir)) {
        mkdirSync(docsAppGeneratedDir, { recursive: true });
    }
    await generateNpmData();
    await generateDocumentalistData();
} catch (err) {
    // console.error messages get swallowed by lerna but console.log is emitted to terminal.
    console.error(`[docs-data] ERROR when generating JSON docs data:`);
    throw new Error(err);
}

console.info(`[docs-data] successfully generated docs.json`);

// ---------------------------------------------------------------------------
// Markdown / MDX page processing (replaces MarkdownPlugin)
// ---------------------------------------------------------------------------

/**
 * Extract heading items from raw markdown content.
 * Only extracts h1–h3 to match the previous Documentalist behavior.
 */
function extractHeadings(markdownContent: string): DocContentItem[] {
    const items: DocContentItem[] = [];
    let match: RegExpExecArray | null;
    HEADING_RE.lastIndex = 0;
    while ((match = HEADING_RE.exec(markdownContent)) !== null) {
        const level = match[1].length;
        // Strip inline code backticks and other simple markdown formatting
        const value = match[2].replace(/`([^`]+)`/g, "$1").trim();
        items.push({ tag: "heading", level, value, route: "" });
    }
    return items;
}

/**
 * Scan all .mdx files in the library and docs packages, parse frontmatter
 * and extract headings to build DocPage entries. Also builds a mapping from
 * page reference to the .mdx file's import path for the MDX page registry.
 */
function buildMdxPages(): { pages: Record<string, DocPage>; importMap: Map<string, string> } {
    const pages: Record<string, DocPage> = {};
    const importMap = new Map<string, string>();

    const mdxGlob = `../{${LIBRARY_AND_DOCS_PACKAGES.join(",")}}/src/**/*.mdx`;
    const mdxFiles = glob.sync(mdxGlob, { cwd: cwd() });

    for (const filePath of mdxFiles) {
        const raw = readFileSync(filePath, "utf-8");
        const { data: frontmatter, content } = grayMatter(raw);

        // Derive reference: use frontmatter.reference if present, otherwise filename without extension
        const filename = basename(filePath, ".mdx");
        // Skip the _nav stub
        if (filename === "_nav") continue;

        const reference: string = (frontmatter.reference as string) ?? filename;
        const title: string = (frontmatter.title as string) ?? reference;

        // Source path relative to monorepo root (for "Edit this page" links)
        // filePath is relative to cwd (packages/docs-data), so resolve then make relative to monorepo root
        const absolutePath = resolve(cwd(), filePath);
        const sourcePath = relative(monorepoRootDir, absolutePath).replace(/\\/g, "/");

        // Import path for webpack: use @blueprintjs scope alias for library packages,
        // but relative paths for docs-app's own files (since docs-app doesn't self-reference in node_modules)
        const importPath = sourcePath.startsWith("packages/docs-app/")
            ? "./" + relative("packages/docs-app/src/generated", sourcePath).replace(/\\/g, "/")
            : sourcePath.replace(/^packages\//, "@blueprintjs/");

        const headings = extractHeadings(content);

        pages[reference] = {
            title,
            route: "", // will be assigned by assignRoutes()
            contents: headings,
            metadata: { ...frontmatter },
            sourcePath,
        };

        importMap.set(reference, importPath);
    }

    return { pages, importMap };
}

/**
 * Generate the mdxPages.ts registry file in the docs-app generated dir.
 */
function generateMdxPagesRegistry(importMap: Map<string, string>, pageRefs: string[]): void {
    const lines: string[] = [
        `// Auto-generated by compile-docs-data.mts — do not edit`,
        `import type { ComponentType } from "react";`,
        ``,
    ];

    // Only generate imports for pages that are in the nav config
    const refsInNav = new Set(pageRefs);
    const entries: Array<{ ref: string; varName: string; importPath: string }> = [];

    for (const [ref, importPath] of importMap) {
        if (!refsInNav.has(ref)) continue;
        // Create a safe variable name from the reference
        const varName = `mdx_${ref.replace(/[^a-zA-Z0-9]/g, "_")}`;
        entries.push({ ref, varName, importPath });
    }

    // Sort for deterministic output
    entries.sort((a, b) => a.ref.localeCompare(b.ref));

    for (const { varName, importPath } of entries) {
        lines.push(`import ${varName} from "${importPath}";`);
    }

    lines.push(``);
    lines.push(`export const mdxPages: Record<string, ComponentType> = {`);
    for (const { ref, varName } of entries) {
        lines.push(`    "${ref}": ${varName},`);
    }
    lines.push(`};`);
    lines.push(``);

    writeFileSync(join(docsAppGeneratedDir, "mdxPages.ts"), lines.join("\n"));
    console.info(`[docs-data] successfully generated mdxPages.ts (${entries.length} pages)`);
}

// ---------------------------------------------------------------------------
// Main documentation generation
// ---------------------------------------------------------------------------

async function generateDocumentalistData(): Promise<void> {
    // 1. Build MDX pages (replaces MarkdownPlugin)
    const { pages, importMap } = buildMdxPages();

    // 2. Run Documentalist for TypeScript and KSS data only
    const documentalist = new Documentalist({
        // must mark our @Decorator APIs as reserved so we can use them in code samples
        reservedTags: ["import", "ContextMenuTarget", "HotkeysTarget", "param", "returns", "use"],
        sourceBaseDir: monorepoRootDir,
    })
        .use(
            /\.tsx?$/,
            new TypescriptPlugin({
                excludeNames: [/.+State$/],
                excludePaths: ["node_modules/", "-app/", "test-commons/", "-build-scripts/", "test/"],
                verbose: true,
            }),
        )
        .use(".scss", new KssPlugin());

    const docs = await documentalist.documentGlobs(
        `../{${LIBRARY_PACKAGES.join(",")}}/src/**/*.scss`,
        `../{${LIBRARY_PACKAGES.join(",")}}/src/index.ts`,
        `../{${LIBRARY_PACKAGES}}/package.json`,
    );

    // 3. Merge MDX pages into the documentalist output
    (docs as any).pages = pages;

    // 4. Apply nav config: assign routes and build nav tree
    const rawConfig: RawNavStructure = JSON.parse(readFileSync(new URL("./nav.json", import.meta.url), "utf-8"));
    validateNavConfig(rawConfig);
    const navConfig = normalizeNavConfig(rawConfig);
    applyNavConfig(docs as any, navConfig);

    // 5. Write docs.json
    const content = JSON.stringify(docs, transformDocumentalistData, 2);
    writeFileSync(docsDataFilePath, content);

    // 6. Generate mdxPages.ts registry for docs-app
    const pageRefs = getPageRefs(rawConfig);
    generateMdxPagesRegistry(importMap, pageRefs);

    // 7. Generate CJS module so src/index.js can re-export nav constants
    const navConstants = [
        `// Auto-generated by compile-docs-data.mts — do not edit`,
        `module.exports.PACKAGES = ${JSON.stringify(PACKAGES)};`,
        `module.exports.SECTIONS = ${JSON.stringify(SECTIONS)};`,
    ].join("\n");
    writeFileSync(join(generatedSrcDir, "nav-constants.js"), navConstants);
}

export function transformDocumentalistData(key: string, value: any): any {
    if (key === "versions" && Array.isArray(value)) {
        return sortMajorVersions(value);
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
export function interpolateClassNamespace(value: string): string {
    return value.replace(/#{\$ns}|@ns/g, Classes.getClassNamespace());
}

async function fetchNpmPackageInfo(
    packageName: string,
): Promise<{ name: string; version: string; versions: string[]; nextVersion?: string }> {
    // Get all package versions
    const fullData = await packageJson(packageName, { allVersions: true });
    const allVersions = Object.keys(fullData.versions ?? {});

    const versions = sortMajorVersions(allVersions);
    const version = fullData["dist-tags"].latest;
    const nextVersion = fullData["dist-tags"].next;

    return { name: packageName, version: version!, versions, nextVersion };
}

export function sortMajorVersions(packageVersions: string[]): string[] {
    const majors = new Map<number, string>();
    for (const v of packageVersions) {
        const maj = semver.major(v);
        if (semver.prerelease(v)) continue;
        if (!majors.has(maj) || semver.gt(v, majors.get(maj)!)) {
            majors.set(maj, v);
        }
    }

    return Array.from(majors.values()).sort(semver.rcompare);
}

async function generateNpmData(): Promise<void> {
    const npmDataFilePath = join(generatedSrcDir, "npm-data.json");
    const npmData: Record<string, { name: string; version: string; versions: string[]; nextVersion?: string }> = {};

    await Promise.all(
        LIBRARY_PACKAGES.map(async pkg => {
            const pkgJsonPath = join(monorepoRootDir, "packages", pkg, "package.json");
            const { name, version: localVersion } = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
            try {
                // Fetch from the npm registry rather than using localVersion above,
                // since the local package.json may reference an unpublished or
                // pre-release version. localVersion is only used as a fallback
                // if the registry request fails.
                npmData[name] = await fetchNpmPackageInfo(name);
            } catch (err) {
                console.warn(
                    `[docs-data] WARNING: failed to fetch npm data for ${name}, falling back to local version`,
                );
                console.warn(`  ${err}`);
                npmData[name] = { name, version: localVersion, versions: [localVersion] };
            }
        }),
    );

    writeFileSync(npmDataFilePath, JSON.stringify(npmData) + "\n");
    console.info("[docs-data] successfully generated npm-data.json");
}

function validateNavConfig(raw: RawNavStructure): void {
    for (const entry of raw) {
        if (!PACKAGES.some(p => p === entry.package)) {
            throw new Error(
                `[docs-data] nav.json contains unknown package "${entry.package}". Known packages: ${PACKAGES.join(", ")}`,
            );
        }
        for (const section of entry.sections ?? []) {
            if (!SECTIONS.some(s => s === section.section)) {
                throw new Error(
                    `[docs-data] nav.json contains unknown section "${section.section}" in package "${entry.package}". Known sections: ${SECTIONS.join(", ")}`,
                );
            }
        }
    }
}

function applyNavConfig(docs: { pages: Record<string, DocPage>; nav: NavTreeNode[] }, navConfig: NavStructure): void {
    assignRoutes(navConfig, docs.pages);
    docs.nav = buildNavTree(navConfig, docs.pages);
}
