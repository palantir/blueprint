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

import { readFileSync } from "node:fs";

import type * as PageTree from "fumadocs-core/page-tree";
import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { assignRoutes, buildPageTree, normalizeNavConfig, requirePage, slugify } from "./navHelpers.mts";
import { PACKAGES, SECTIONS } from "./navTypes.mts";
import type { DocContentItem, DocHeadingItem, DocPage, NavStructure, RawNavStructure } from "./navTypes.mts";

describe("normalizeNavConfig", () => {
    it("should convert bare strings to NavPageRef objects", () => {
        const raw: RawNavStructure = [{ package: "core", pages: ["getting-started", "reading-list"] }];

        const result = normalizeNavConfig(raw);

        expect(result).toEqual([
            {
                package: "core",
                pages: [
                    { type: "page", ref: "getting-started" },
                    { type: "page", ref: "reading-list" },
                ],
                sections: undefined,
            },
        ]);
    });

    it("should convert section pages from bare strings to NavPageRef objects", () => {
        const raw: RawNavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "components",
                        pages: ["buttons", "dialog", "popover"],
                    },
                ],
            },
        ];

        const result = normalizeNavConfig(raw);

        expect(result[0].sections).toEqual([
            {
                section: "components",
                pages: [
                    { type: "page", ref: "buttons" },
                    { type: "page", ref: "dialog" },
                    { type: "page", ref: "popover" },
                ],
            },
        ]);
    });

    it("should handle packages with no sections", () => {
        const raw: RawNavStructure = [{ package: "icons", pages: ["icons-list"] }];

        const result = normalizeNavConfig(raw);

        expect(result[0].sections).toBeUndefined();
    });
});

describe("assignRoutes", () => {
    it("should assign flat routes for a package with direct pages", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            "getting-started": makePage("Getting Started"),
            "reading-list": makePage("Reading List"),
        };
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [
                    { type: "page", ref: "getting-started" },
                    { type: "page", ref: "reading-list" },
                ],
                sections: [],
            },
        ];

        assignRoutes(navConfig, pages);

        expect(pages.core.route).toBe("core");
        expect(pages["getting-started"].route).toBe("core/getting-started");
        expect(pages["reading-list"].route).toBe("core/reading-list");
    });

    it("should assign nested routes through sections", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            components: makePage("Components"),
            buttons: makePage("Buttons"),
            dialog: makePage("Dialog"),
            popover: makePage("Popover"),
        };
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "components",
                        pages: [
                            { type: "page", ref: "buttons" },
                            { type: "page", ref: "dialog" },
                            { type: "page", ref: "popover" },
                        ],
                    },
                ],
            },
        ];

        assignRoutes(navConfig, pages);

        expect(pages.components.route).toBe("core/components");
        expect(pages.buttons.route).toBe("core/components/buttons");
        expect(pages.dialog.route).toBe("core/components/dialog");
        expect(pages.popover.route).toBe("core/components/popover");
    });

    it("should throw on duplicate refs", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            components: makePage("Components"),
            buttons: makePage("Buttons"),
        };
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [{ type: "page", ref: "buttons" }],
                sections: [
                    {
                        section: "components",
                        pages: [{ type: "page", ref: "buttons" }],
                    },
                ],
            },
        ];

        expect(() => assignRoutes(navConfig, pages)).toThrow('[docs-data] duplicate nav ref "buttons"');
    });

    it("should set page.route and heading routes", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            components: makePage("Components"),
            buttons: makePage("Buttons", [makeHeading("Buttons", 1), makeHeading("Usage", 2), "Some text content"]),
        };
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "components",
                        pages: [{ type: "page", ref: "buttons" }],
                    },
                ],
            },
        ];

        assignRoutes(navConfig, pages);

        expect(pages.buttons.route).toBe("core/components/buttons");
        // Level 1 heading gets the page route
        expect((pages.buttons.contents[0] as DocHeadingItem).route).toBe("core/components/buttons");
        // Level 2 heading gets slugified sub-route
        expect((pages.buttons.contents[1] as DocHeadingItem).route).toBe("core/components/buttons.usage");
    });

    it("should not modify pages that are not referenced in the nav config", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            _nav: makePage("Nav", [makeHeading("Internal", 1)]),
        };
        const navConfig: NavStructure = [{ package: "core", pages: [] }];

        assignRoutes(navConfig, pages);

        // _nav is not in the nav config, so its route remains unchanged
        expect(pages._nav.route).toBe("");
    });
});

describe("slugify", () => {
    it("should lowercase and replace non-alphanumeric chars with hyphens", () => {
        expect(slugify("Hello World!")).toBe("hello-world");
        expect(slugify("Date & Time Pickers")).toBe("date-and-time-pickers");
    });

    it("should replace '&' with 'and'", () => {
        expect(slugify("A & B")).toBe("a-and-b");
        expect(slugify("&start")).toBe("andstart");
        expect(slugify("end&")).toBe("endand");
    });

    it("should collapse consecutive hyphens and trim edges", () => {
        expect(slugify("a - - b")).toBe("a-b");
        expect(slugify("!leading")).toBe("leading");
        expect(slugify("trailing!")).toBe("trailing");
    });

    it("should preserve existing hyphens and pass through alphanumeric chars", () => {
        expect(slugify("already-slugified")).toBe("already-slugified");
        expect(slugify("abc123")).toBe("abc123");
    });
});

describe("buildPageTree", () => {
    it("should produce a Root with Folder children matching nav config shape", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            overview: makePage("Overview"),
        };
        const navConfig: NavStructure = [{ package: "core", pages: [{ type: "page", ref: "overview" }] }];

        const tree = buildPageTree(navConfig, pages);

        expect(tree.name).toBe("Blueprint");
        expect(tree.children).toHaveLength(1);

        const folder = tree.children[0] as PageTree.Folder;
        expect(folder.type).toBe("folder");
        expect(folder.name).toBe("Core");
        expect(folder.$id).toBe("core");
        expect(folder.index).toBeDefined();
        expect(folder.index!.url).toBe("core");

        expect(folder.children).toHaveLength(1);
        const item = folder.children[0] as PageTree.Item;
        expect(item.type).toBe("page");
        expect(item.name).toBe("Overview");
        expect(item.url).toBe("core/overview");
        expect(item.$id).toBe("overview");
    });

    it("should include section folders with child items at correct structure", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            components: makePage("Components"),
            buttons: makePage("Buttons"),
        };
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "components",
                        pages: [{ type: "page", ref: "buttons" }],
                    },
                ],
            },
        ];

        const tree = buildPageTree(navConfig, pages);

        const packageFolder = tree.children[0] as PageTree.Folder;
        expect(packageFolder.children).toHaveLength(1);

        const sectionFolder = packageFolder.children[0] as PageTree.Folder;
        expect(sectionFolder.type).toBe("folder");
        expect(sectionFolder.name).toBe("Components");
        expect(sectionFolder.$id).toBe("core/components");
        expect(sectionFolder.index).toBeDefined();
        expect(sectionFolder.index!.url).toBe("core/components");

        expect(sectionFolder.children).toHaveLength(1);
        const item = sectionFolder.children[0] as PageTree.Item;
        expect(item.type).toBe("page");
        expect(item.$id).toBe("buttons");
        expect(item.url).toBe("core/components/buttons");
    });

    it("should handle sections without a backing page by using title-cased name", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            dialog: makePage("Dialog"),
            popover: makePage("Popover"),
        };
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "overlays",
                        pages: [
                            { type: "page", ref: "dialog" },
                            { type: "page", ref: "popover" },
                        ],
                    },
                ],
            },
        ];

        const tree = buildPageTree(navConfig, pages);

        const packageFolder = tree.children[0] as PageTree.Folder;
        const sectionFolder = packageFolder.children[0] as PageTree.Folder;
        expect(sectionFolder.name).toBe("Overlays");
        expect(sectionFolder.index).toBeUndefined();
        expect(sectionFolder.children).toHaveLength(2);
    });

    it("should handle packages without a backing page by using title-cased name", () => {
        const pages: Record<string, DocPage> = {
            overview: makePage("Overview"),
        };
        const navConfig: NavStructure = [{ package: "core", pages: [{ type: "page", ref: "overview" }] }];

        const tree = buildPageTree(navConfig, pages);

        const folder = tree.children[0] as PageTree.Folder;
        expect(folder.name).toBe("Core");
        expect(folder.index).toBeUndefined();
    });
});

describe("requirePage", () => {
    it("should return the page object for a valid ref", () => {
        const page = makePage("Buttons");
        const pages = { buttons: page };

        expect(requirePage("buttons", pages)).toBe(page);
    });

    it("should throw when the ref does not exist in pages", () => {
        expect(() => requirePage("nonexistent", {})).toThrow();
    });
});

describe("nested sections", () => {
    it("should not support sections nested within sections", () => {
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "overlays",
                        pages: [{ type: "page", ref: "modals" }],
                    },
                ],
            },
        ];

        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            overlays: makePage("Overlays"),
            dialog: makePage("Dialog"),
            drawer: makePage("Drawer"),
        };

        // "modals" is intended as a nested section, but the system only supports pages
        // as children of sections. buildPageTree calls requirePage("modals") which throws
        // because there is no DocPage entry for it.
        expect(() => buildPageTree(navConfig, pages)).toThrow(
            '[docs-data] nav.json references page "modals" which does not exist in docs.pages',
        );
    });
});

describe("canonical PACKAGES and SECTIONS arrays", () => {
    const navJson: RawNavStructure = JSON.parse(readFileSync(new URL("./nav.json", import.meta.url), "utf-8"));

    it("PACKAGES includes every package in nav.json", () => {
        const navPackages = navJson.map(entry => entry.package);
        for (const pkg of navPackages) {
            expect(PACKAGES.some(p => p === pkg)).toBe(true);
        }
    });

    it("SECTIONS includes every section in nav.json", () => {
        const navSections = navJson.flatMap(entry => (entry.sections ?? []).map(s => s.section));
        for (const section of navSections) {
            expect(SECTIONS.some(s => s === section)).toBe(true);
        }
    });

    it("public API PACKAGES matches navTypes", () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const publicApi = require("./src/index.js");
        expect([...publicApi.PACKAGES]).toEqual([...PACKAGES]);
    });

    it("public API SECTIONS matches navTypes", () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const publicApi = require("./src/index.js");
        expect([...publicApi.SECTIONS]).toEqual([...SECTIONS]);
    });
});

/** Minimal page object with a title and contents array. */
function makePage(title: string, contents: DocContentItem[] = []): DocPage {
    return { title, contents, route: "" };
}

/** Shorthand for a heading content item. */
function makeHeading(value: string, level: number, route = "") {
    return { tag: "heading" as const, value, level, route };
}
