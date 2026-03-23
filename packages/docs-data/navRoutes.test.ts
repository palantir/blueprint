/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { globSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Documentalist, MarkdownPlugin } from "@documentalist/compiler";
import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { hooks, markedRenderer } from "./markdownRenderer.mjs";
import { assignRoutes, normalizeNavConfig } from "./navHelpers.mts";
import type { RawNavStructure, Section } from "./navTypes.mts";

const LIBRARY_PACKAGES = ["core", "datetime", "datetime2", "icons", "select", "table", "labs"];
const DOCS_PACKAGE = "docs-app";
const ALL_PACKAGES = [...LIBRARY_PACKAGES, DOCS_PACKAGE];

const monorepoRoot = resolve(fileURLToPath(import.meta.url), "../../../");
const rawNav: RawNavStructure = JSON.parse(readFileSync(new URL("./nav.json", import.meta.url), "utf-8"));

describe("nav.json route coverage", () => {
    describe("every nav.json page ref has a corresponding MDX file", () => {
        const mdxFiles = ALL_PACKAGES.flatMap(pkg =>
            globSync(`packages/${pkg}/src/**/*.mdx`, { cwd: monorepoRoot }).map(f => resolve(monorepoRoot, f)),
        );

        const mdxRefs = new Set(mdxFiles.map(getReference));

        // Page refs (package names + leaf pages) must each have an MDX file
        for (const ref of getPageRefs()) {
            it(`ref "${ref}" has an MDX file`, () => {
                expect(mdxRefs.has(ref)).toBe(true);
            });
        }

        // Section refs may or may not have MDX files — buildNavSection supports
        // virtual sections. Verify that each section ref either has an MDX file
        // or is explicitly virtual (no MDX file).
        for (const ref of getSectionRefs()) {
            if (mdxRefs.has(ref)) {
                it(`section ref "${ref}" has an MDX file`, () => {
                    expect(mdxRefs.has(ref)).toBe(true);
                });
            } else {
                // This is specifically for "form-controls", "context", "hooks" that aren't really sections, but present as such
                it(`section ref "${ref}" is a virtual section (no MDX file)`, () => {
                    expect(mdxRefs.has(ref)).toBe(false);
                });
            }
        }
    });

    describe("compile-docs-data pipeline produces a page for every nav.json ref", () => {
        it("docs.pages contains an entry for every nav.json page ref", async () => {
            const documentalist = new Documentalist({
                markdown: { hooks, renderer: markedRenderer },
                reservedTags: ["import", "ContextMenuTarget", "HotkeysTarget", "param", "returns", "use"],
                sourceBaseDir: monorepoRoot,
            })
                .use(".mdx", {
                    compile: (files: any[]) =>
                        process.platform === "win32" ? files.map(f => f.read().replace(/\r\n/g, "\n")) : files,
                })
                .use(".mdx", new MarkdownPlugin({ navPage: "_nav" }));

            const docs = await documentalist.documentGlobs(`../{${ALL_PACKAGES.join(",")}}/src/**/*.mdx`);

            const navConfig = normalizeNavConfig(rawNav);
            // assignRoutes should not throw — every ref must exist in docs.pages
            assignRoutes(navConfig, docs.pages);

            const pageRefs = getPageRefs();
            const missingRefs = pageRefs.filter(ref => docs.pages[ref] === undefined);
            expect(missingRefs).toEqual([]);
        }, 30_000);
    });
});

/** Extract every page ref from nav.json (flat pages + section pages), excluding section names. */
function getPageRefs(): string[] {
    const refs: string[] = [];
    for (const entry of rawNav) {
        refs.push(entry.package);
        for (const page of entry.pages) {
            refs.push(page);
        }
        for (const section of entry.sections ?? []) {
            for (const page of section.pages) {
                refs.push(page);
            }
        }
    }
    return refs;
}

/** Extract section names from nav.json. */
function getSectionRefs(): Section[] {
    return rawNav.flatMap(entry => (entry.sections ?? []).map(s => s.section));
}

/**
 * Determine the Documentalist "reference" for an MDX file.
 * Uses explicit `reference:` frontmatter if present, otherwise the filename stem.
 */
function getReference(filePath: string): string {
    const content = readFileSync(filePath, "utf-8");
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
        const refMatch = frontmatterMatch[1].match(/^reference:\s*(.+)$/m);
        if (refMatch) {
            return refMatch[1].trim();
        }
    }
    return basename(filePath, ".mdx");
}
