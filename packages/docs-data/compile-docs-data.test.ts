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
import type * as DocumentalistCompiler from "@documentalist/compiler";
import type * as NodeFs from "node:fs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import packageJson from "package-json";
import { vi } from "vitest";

import { beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";

import {
    compileDocsData,
    interpolateClassNamespace,
    sortMajorVersions,
    transformDocumentalistData,
} from "./compile-docs-data.mts";

const { documentGlobs } = vi.hoisted(() => ({ documentGlobs: vi.fn() }));

vi.mock("node:fs", async importOriginal => {
    const original = await importOriginal<typeof NodeFs>();
    return {
        ...original,
        mkdirSync: vi.fn(),
        readFileSync: vi.fn((...args: Parameters<typeof readFileSync>) =>
            args[0].toString() === new URL("./nav.json", import.meta.url).href ? "[]" : original.readFileSync(...args),
        ),
        writeFileSync: vi.fn(),
    };
});

vi.mock("package-json", () => ({ default: vi.fn() }));

vi.mock("@documentalist/compiler", async importOriginal => {
    function mockDocumentalist() {
        return {
            documentGlobs,
            use() {
                return this;
            },
        };
    }

    return {
        ...(await importOriginal<typeof DocumentalistCompiler>()),
        Documentalist: vi.fn(mockDocumentalist),
    };
});

describe("compilation entry point", () => {
    it("does not compile, fetch metadata, or write files when imported", () => {
        expect(Documentalist).not.toHaveBeenCalled();
        expect(packageJson).not.toHaveBeenCalled();
        expect(mkdirSync).not.toHaveBeenCalled();
        expect(writeFileSync).not.toHaveBeenCalled();
    });

    describe("explicit compilation", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            vi.mocked(packageJson).mockReset();
            documentGlobs.mockReset().mockResolvedValue({ css: {}, nav: [], pages: {}, typescript: {} });
        });

        it("generates documentation without fetching or overwriting npm metadata", async () => {
            await compileDocsData("docs");

            expect(Documentalist).toHaveBeenCalledOnce();
            expect(packageJson).not.toHaveBeenCalled();
            expect(writtenFiles()).toEqual(["docs.json", "nav-constants.js"]);
        });

        it("propagates extraction failures without writing partial documentation", async () => {
            const error = new Error("Extraction failed");
            documentGlobs.mockRejectedValue(error);
            const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

            try {
                await expect(compileDocsData("docs")).rejects.toBe(error);
                expect(writeFileSync).not.toHaveBeenCalled();
            } finally {
                errorLog.mockRestore();
            }
        });

        it("refreshes npm metadata independently of documentation extraction", async () => {
            vi.mocked(packageJson).mockResolvedValue({
                "dist-tags": { latest: "6.2.0", next: "7.0.0-beta.1" },
                versions: { "5.0.0": {}, "5.1.0": {}, "6.2.0": {}, "7.0.0-beta.1": {} },
            } as Awaited<ReturnType<typeof packageJson>>);

            await compileDocsData("npm");

            expect(Documentalist).not.toHaveBeenCalled();
            expect(writtenFiles()).toEqual(["npm-data.json"]);
            const data = JSON.parse(vi.mocked(writeFileSync).mock.calls[0][1] as string);
            expect(data["@blueprintjs/icons"]).toEqual({
                name: "@blueprintjs/icons",
                nextVersion: "7.0.0-beta.1",
                version: "6.2.0",
                versions: ["6.2.0", "5.1.0"],
            });
        });

        it("falls back to the local package version when the registry is unavailable", async () => {
            vi.mocked(packageJson).mockRejectedValue(new Error("Registry unavailable"));
            const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);

            try {
                await compileDocsData("npm");

                const { name, version } = JSON.parse(
                    readFileSync(new URL("../icons/package.json", import.meta.url), "utf8"),
                );
                const data = JSON.parse(vi.mocked(writeFileSync).mock.calls[0][1] as string);
                expect(data[name]).toEqual({ name, version, versions: [version] });
                expect(warning).toHaveBeenCalled();
                expect(writtenFiles()).toEqual(["npm-data.json"]);
            } finally {
                warning.mockRestore();
            }
        });
    });
});

function writtenFiles(): string[] {
    return vi.mocked(writeFileSync).mock.calls.map(([path]) => basename(path as string));
}

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
