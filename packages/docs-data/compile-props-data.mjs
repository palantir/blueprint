#!/usr/bin/env node
/**
 * @license Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates props registry data for packages/docs-app using react-docgen-typescript
 */

// @ts-check

import * as docgen from "react-docgen-typescript";
import { globSync } from "glob";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { cwd } from "node:process";

/** Library packages to extract props from */
const LIBRARY_PACKAGES = ["core", "datetime", "datetime2", "icons", "select", "table", "labs"];

// assume we are running from packages/docs-data
const monorepoRootDir = resolve(cwd(), "../../");
const generatedSrcDir = resolve(cwd(), "./src/generated");

// ensure output directory exists
if (!existsSync(generatedSrcDir)) {
    mkdirSync(generatedSrcDir, { recursive: true });
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
        `// Auto-generated by compile-props-data.mjs — do not edit\n` +
        `import type { PropsRegistry } from "../types";\n` +
        `\n` +
        `export const propsRegistry: PropsRegistry = ${JSON.stringify(registry, null, 4)};\n`;

    writeFileSync(join(generatedSrcDir, "propsRegistry.ts"), output);
    console.info(`[docs-data] generated propsRegistry.ts (${Object.keys(registry).length} interfaces)`);
}

console.info(`[docs-data] generating props registry for library packages: ${LIBRARY_PACKAGES.join(", ")}`);
generatePropsRegistry();
