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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import {
    assignRoutes,
    buildNavLeafPage,
    buildNavTree,
    buildNavPage,
    buildNavSection,
    extractHeadingChildren,
    getPageRefs,
    getSectionRefs,
    normalizeNavConfig,
    requirePage,
    slugify,
} from "./navHelpers.mts";
import { PACKAGES, SECTIONS } from "./navTypes.mts";
import type {
    DocContentItem,
    DocHeadingItem,
    DocPage,
    NavSection,
    NavStructure,
    NavTreePage,
    RawNavStructure,
} from "./navTypes.mts";

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

    it("should route section children through routeAlias when set", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            overlays: makePage("Overlays"),
            popover: makePage("Popover", [makeHeading("Popover", 1), makeHeading("Concepts", 2)]),
        };
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "overlays",
                        routeAlias: "components",
                        pages: [{ type: "page", ref: "popover" }],
                    },
                ],
            },
        ];

        assignRoutes(navConfig, pages);

        // section landing route is unchanged
        expect(pages.overlays.route).toBe("core/overlays");
        // child page and its sub-headings are routed under the alias
        expect(pages.popover.route).toBe("core/components/popover");
        expect((pages.popover.contents[1] as DocHeadingItem).route).toBe("core/components/popover.concepts");
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

describe("buildNavTree", () => {
    it("should produce a tree of PageNodes matching the nav config shape", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            overview: makePage("Overview"),
        };
        const navConfig: NavStructure = [{ package: "core", pages: [{ type: "page", ref: "overview" }] }];

        const tree = buildNavTree(navConfig, pages);

        expect(tree).toHaveLength(1);
        expect(tree[0].reference).toBe("core");
        expect(tree[0].route).toBe("core");
        expect(tree[0].level).toBe(1);
        expect(tree[0].children).toHaveLength(1);
        expect((tree[0].children[0] as NavTreePage).reference).toBe("overview");
        expect((tree[0].children[0] as NavTreePage).route).toBe("core/overview");
    });

    it("should apply routeAlias to section children but keep section route unchanged", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
            popover: makePage("Popover"),
        };
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "overlays",
                        routeAlias: "components",
                        pages: [{ type: "page", ref: "popover" }],
                    },
                ],
            },
        ];

        const tree = buildNavTree(navConfig, pages);

        const sectionNode = tree[0].children[0] as NavTreePage;
        expect(sectionNode.reference).toBe("overlays");
        expect(sectionNode.route).toBe("core/overlays");
        expect((sectionNode.children[0] as NavTreePage).route).toBe("core/components/popover");
    });

    it("should include section children and leaf pages at correct levels", () => {
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

        const tree = buildNavTree(navConfig, pages);

        const sectionNode = tree[0].children[0] as NavTreePage;
        expect(sectionNode.reference).toBe("components");
        expect(sectionNode.route).toBe("core/components");
        expect(sectionNode.level).toBe(2);
        expect((sectionNode.children[0] as NavTreePage).reference).toBe("buttons");
        expect((sectionNode.children[0] as NavTreePage).route).toBe("core/components/buttons");
        expect(sectionNode.children[0].level).toBe(3);
    });
});

describe("buildNavSection", () => {
    it("should build a section node with leaf page children", () => {
        const pages: Record<string, DocPage> = {
            components: makePage("Components"),
            buttons: makePage("Buttons"),
            dialog: makePage("Dialog"),
        };
        const section: NavSection = {
            section: "components",
            pages: [
                { type: "page", ref: "buttons" },
                { type: "page", ref: "dialog" },
            ],
        };

        const node = buildNavSection(section, 2, "core/components", "core/components", pages);

        expect(node.reference).toBe("components");
        expect(node.route).toBe("core/components");
        expect(node.level).toBe(2);
        expect(node.children).toHaveLength(2);
        expect((node.children[0] as NavTreePage).reference).toBe("buttons");
        expect((node.children[0] as NavTreePage).route).toBe("core/components/buttons");
        expect((node.children[1] as NavTreePage).reference).toBe("dialog");
        expect((node.children[1] as NavTreePage).route).toBe("core/components/dialog");
    });

    it("should handle sections without a backing documentalist page", () => {
        const pages: Record<string, DocPage> = {
            dialog: makePage("Dialog"),
            popover: makePage("Popover"),
        };
        const section: NavSection = {
            section: "overlays",
            pages: [
                { type: "page", ref: "dialog" },
                { type: "page", ref: "popover" },
            ],
        };

        const node = buildNavSection(section, 2, "core/overlays", "core/overlays", pages);

        expect(node.reference).toBe("overlays");
        expect(node.title).toBe("Overlays");
        expect(node.route).toBe("core/overlays");
        expect(node.children).toHaveLength(2);
        expect((node.children[0] as NavTreePage).reference).toBe("dialog");
        expect((node.children[0] as NavTreePage).route).toBe("core/overlays/dialog");
        expect((node.children[1] as NavTreePage).reference).toBe("popover");
        expect((node.children[1] as NavTreePage).route).toBe("core/overlays/popover");
    });

    it("should route children through childRoutePrefix when it differs from the section route", () => {
        const pages: Record<string, DocPage> = {
            dialog: makePage("Dialog"),
            popover: makePage("Popover"),
        };
        const section: NavSection = {
            section: "overlays",
            routeAlias: "components",
            pages: [
                { type: "page", ref: "dialog" },
                { type: "page", ref: "popover" },
            ],
        };

        const node = buildNavSection(section, 2, "core/overlays", "core/components", pages);

        expect(node.route).toBe("core/overlays");
        expect((node.children[0] as NavTreePage).route).toBe("core/components/dialog");
        expect((node.children[1] as NavTreePage).route).toBe("core/components/popover");
    });
});

describe("buildNavLeafPage", () => {
    it("should build a leaf node with heading children extracted from page contents", () => {
        const pages: Record<string, DocPage> = {
            buttons: makePage("Buttons", [
                makeHeading("Buttons", 1),
                makeHeading("Usage", 2, "core/components/buttons.usage"),
                makeHeading("Props", 2, "core/components/buttons.props"),
            ]),
        };

        const node = buildNavLeafPage("buttons", 3, "core/components/buttons", pages);

        expect(node.reference).toBe("buttons");
        expect(node.route).toBe("core/components/buttons");
        expect(node.level).toBe(3);
        // Should have 2 heading children (level 1 is skipped)
        expect(node.children).toHaveLength(2);
        expect(node.children[0].title).toBe("Usage");
        expect(node.children[1].title).toBe("Props");
    });

    it("should produce an empty children array for a page with no level-2+ headings", () => {
        const pages: Record<string, DocPage> = {
            overview: makePage("Overview", [makeHeading("Overview", 1), "Some text"]),
        };

        const node = buildNavLeafPage("overview", 2, "core/overview", pages);

        expect(node.children).toHaveLength(0);
    });
});

describe("buildNavPage", () => {
    it("should assemble a PageNode with the correct shape", () => {
        const pages: Record<string, DocPage> = {
            buttons: makePage("Buttons"),
        };
        const children = [
            { type: "heading" as const, title: "Usage", level: 4, route: "core/components/buttons.usage" },
        ];

        const node = buildNavPage("buttons", 3, "core/components/buttons", pages, children);

        expect(node).toEqual({
            type: "page",
            children,
            level: 3,
            reference: "buttons",
            route: "core/components/buttons",
            title: "Buttons",
        });
    });

    it("should preserve heading child routes like buttons.usage", () => {
        const pages: Record<string, DocPage> = {
            buttons: makePage("Buttons"),
        };
        const children = [
            { type: "heading" as const, title: "Usage", level: 4, route: "core/components/buttons.usage" },
        ];

        const node = buildNavPage("buttons", 3, "core/components/buttons", pages, children);

        expect(node.children[0]).toEqual({
            type: "heading",
            title: "Usage",
            level: 4,
            route: "core/components/buttons.usage",
        });
    });

    it("should use the provided route for the node", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
        };

        const node = buildNavPage("core", 1, "core", pages, []);

        expect(node.route).toBe("core");
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

describe("extractHeadingChildren", () => {
    it("should extract level-2+ headings with adjusted levels", () => {
        const page = makePage("Components", [
            makeHeading("Components", 1),
            makeHeading("Usage", 2, "components.usage"),
            makeHeading("Details", 3, "components.details"),
        ]);

        // pageNavLevel=2 means levelOffset=1, so heading levels are shifted by +1
        const result = extractHeadingChildren(page, 2);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ type: "heading", title: "Usage", level: 3, route: "components.usage" });
        expect(result[1]).toEqual({ type: "heading", title: "Details", level: 4, route: "components.details" });
    });

    it("should skip level-1 headings and non-heading content items", () => {
        const page = makePage("Buttons", [
            makeHeading("Buttons", 1),
            "Some plain text",
            { tag: "code", value: "example" },
            null,
        ]);

        const result = extractHeadingChildren(page, 1);

        expect(result).toHaveLength(0);
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
        // as children of sections. buildNavTree calls requirePage("modals") which throws
        // because there is no DocPage entry for it.
        expect(() => buildNavTree(navConfig, pages)).toThrow(
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

describe("getPageRefs", () => {
    it("should return package names, flat pages, and section pages", () => {
        const raw: RawNavStructure = [
            {
                package: "core",
                pages: ["getting-started"],
                sections: [{ section: "components", pages: ["buttons", "dialog"] }],
            },
        ];

        expect(getPageRefs(raw)).toEqual(["core", "getting-started", "buttons", "dialog"]);
    });

    it("should handle entries with no sections", () => {
        const raw: RawNavStructure = [{ package: "icons", pages: ["icons-list"] }];

        expect(getPageRefs(raw)).toEqual(["icons", "icons-list"]);
    });

    it("should return an empty array for empty input", () => {
        expect(getPageRefs([])).toEqual([]);
    });
});

describe("getSectionRefs", () => {
    it("should return all section names", () => {
        const raw: RawNavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    { section: "components", pages: ["buttons"] },
                    { section: "overlays", pages: ["dialog"] },
                ],
            },
        ];

        expect(getSectionRefs(raw)).toEqual(["components", "overlays"]);
    });

    it("should return an empty array when no sections exist", () => {
        const raw: RawNavStructure = [{ package: "icons", pages: ["icons-list"] }];

        expect(getSectionRefs(raw)).toEqual([]);
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
