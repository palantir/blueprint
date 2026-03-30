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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { assignRoutes, getPageRefs, getSectionRefs, normalizeNavConfig } from "./navHelpers.mts";
import type { RawNavStructure } from "./navTypes.mts";

const ALL_PACKAGES = ["core", "datetime", "datetime2", "icons", "select", "table", "labs", "docs-app"];

const monorepoRoot = resolve(fileURLToPath(import.meta.url), "../../../");
const rawNav: RawNavStructure = JSON.parse(readFileSync(new URL("./nav.json", import.meta.url), "utf-8"));

describe("nav.json route coverage", () => {
    describe("every nav.json page ref has a corresponding MDX file", () => {
        const mdxFiles = ALL_PACKAGES.flatMap(pkg =>
            globSync(`packages/${pkg}/src/**/*.mdx`, { cwd: monorepoRoot }).map(f => resolve(monorepoRoot, f)),
        );

        const mdxRefs = new Set(mdxFiles.map(getReference));

        // Page refs (package names + leaf pages) must each have an MDX file
        for (const ref of getPageRefs(rawNav)) {
            it(`ref "${ref}" has an MDX file`, () => {
                expect(mdxRefs.has(ref)).toBe(true);
            });
        }

        // Note: section refs (from getSectionRefs) are NOT tested here because
        // sections can be "virtual" — declared in nav.json purely for grouping,
        // with no corresponding MDX file (e.g. "form-controls", "overlays").
    });

    it("should produce valid NavStructure from real nav.json via normalizeNavConfig", () => {
        const navConfig = normalizeNavConfig(rawNav);
        expect(navConfig).toHaveLength(rawNav.length);

        for (const entry of navConfig) {
            expect(entry.pages).toBeDefined();
            expect(Array.isArray(entry.pages)).toBe(true);
            for (const pageRef of entry.pages) {
                expect(pageRef.type).toBe("page");
                expect(typeof pageRef.ref).toBe("string");
            }
            if (entry.sections != null) {
                for (const section of entry.sections) {
                    expect(Array.isArray(section.pages)).toBe(true);
                    for (const pageRef of section.pages) {
                        expect(pageRef.type).toBe("page");
                        expect(typeof pageRef.ref).toBe("string");
                    }
                }
            }
        }
    });

    it("should assignRoutes with no duplicates when given all nav.json refs", () => {
        const makePage = (ref: string) => ({ title: ref, contents: [], route: "" });
        const pages: Record<string, { title: string; contents: never[]; route: string }> = {};
        for (const ref of getPageRefs(rawNav)) {
            pages[ref] = makePage(ref);
        }
        for (const ref of getSectionRefs(rawNav)) {
            pages[ref] = makePage(ref);
        }

        const navConfig = normalizeNavConfig(rawNav);
        // should not throw — no duplicate refs
        assignRoutes(navConfig, pages);

        for (const ref of getPageRefs(rawNav)) {
            expect(pages[ref].route).not.toBe("");
        }
    });
});

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
