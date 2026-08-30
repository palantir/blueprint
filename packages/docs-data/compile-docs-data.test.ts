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

import { Documentalist } from "@documentalist/compiler";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import {
    createMarkdownPlugin,
    interpolateClassNamespace,
    sortMajorVersions,
    transformDocumentalistData,
} from "./compile-docs-data.mts";

describe("interpolateClassNamespace", () => {
    it("replaces #{$ns} and @ns with the default class namespace", () => {
        expect(interpolateClassNamespace("#{$ns}-button")).toBe("bp6-button");
        expect(interpolateClassNamespace("@ns-icon")).toBe("bp6-icon");
        expect(interpolateClassNamespace("#{$ns}-card @ns-elevation")).toBe("bp6-card bp6-elevation");
    });
});

describe("sortMajorVersions", () => {
    it("keeps only the highest version per major and sorts descending", () => {
        const versions = ["1.0.0", "1.2.3", "2.0.0", "2.1.0", "3.0.0", "3.1.4"];
        expect(sortMajorVersions(versions)).toEqual(["3.1.4", "2.1.0", "1.2.3"]);
    });

    it("skips pre-release versions", () => {
        const versions = ["1.0.0", "2.0.0-alpha.1", "2.0.0-beta.3", "2.0.0"];
        expect(sortMajorVersions(versions)).toEqual(["2.0.0", "1.0.0"]);
    });

    it("returns an empty array when given only pre-release versions", () => {
        const versions = ["1.0.0-rc.1", "2.0.0-beta.1"];
        expect(sortMajorVersions(versions)).toEqual([]);
    });
});

describe("transformDocumentalistData", () => {
    it('keeps only the highest version per major and reverses the list when key is "versions"', () => {
        const versions = ["1.0.0", "1.2.3", "2.0.0", "2.1.0", "3.0.0-beta.1", "3.0.0", "3.1.4"];
        const result = transformDocumentalistData("versions", versions);
        expect(result).toEqual(["3.1.4", "2.1.0", "1.2.3"]);
    });

    it("returns non-string, non-versions values unchanged", () => {
        const obj = { foo: "bar" };
        expect(transformDocumentalistData("someKey", obj)).toBe(obj);
        expect(transformDocumentalistData("count", 42)).toBe(42);
    });
});

describe("createMarkdownPlugin", () => {
    const CORE_PAGE = ["---", "title: Core", "reference: core", "---", "", "# Core", "", "Core body.", ""].join("\n");
    const NAV_PAGE = "<!-- nav root, real hierarchy lives in nav.json -->\n";

    /** Compiles a minimal two page docs set whose sources use the given line ending. */
    async function compilePages(lineEnding: string) {
        const withLineEndings = (contents: string) => contents.replace(/\n/g, lineEnding);
        const files = [
            { path: "/packages/docs-app/src/_nav.mdx", read: () => withLineEndings(NAV_PAGE) },
            { path: "/packages/core/src/docs/index.mdx", read: () => withLineEndings(CORE_PAGE) },
        ];
        const { pages } = await new Documentalist().use(".mdx", createMarkdownPlugin()).documentFiles(files);
        return pages;
    }

    it("keys pages by their `reference` metadata when sources use LF line endings", async () => {
        const pages = await compilePages("\n");
        expect(pages.core?.title).toBe("Core");
        expect(pages.index).toBeUndefined();
    });

    // Regression test for https://github.com/palantir/blueprint/issues/8220. Without line ending
    // normalization, documentalist fails to parse the frontmatter and falls back to keying the page
    // by its filename, so every package's index.mdx collides on the "index" key.
    it("keys pages by their `reference` metadata when sources use CRLF line endings", async () => {
        const pages = await compilePages("\r\n");
        expect(pages.core?.title).toBe("Core");
        expect(pages.index).toBeUndefined();
    });
});
