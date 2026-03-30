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
import { assignRoutes, getPageRefs, normalizeNavConfig } from "./navHelpers.mts";
import type { RawNavStructure } from "./navTypes.mts";
import { LIBRARY_PACKAGES } from "./compile-docs-data.mts";

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
        for (const ref of getPageRefs(rawNav)) {
            it(`ref "${ref}" has an MDX file`, () => {
                expect(mdxRefs.has(ref)).toBe(true);
            });
        }

        // Note: section refs (from getSectionRefs) are NOT tested here because
        // sections can be "virtual" — declared in nav.json purely for grouping,
        // with no corresponding MDX file (e.g. "form-controls", "overlays").
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

            const pageRefs = getPageRefs(rawNav);
            const missingRefs = pageRefs.filter(ref => docs.pages[ref] === undefined);
            expect(missingRefs).toEqual([]);
        }, 30_000);
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
