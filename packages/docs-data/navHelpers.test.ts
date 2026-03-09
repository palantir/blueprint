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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import {
    buildLeafPageNode,
    buildNavTree,
    buildPageNodeFromChildren,
    buildRouteMap,
    buildSectionNode,
    extractHeadingChildren,
    fixPageRoutes,
    normalizeNavConfig,
    requirePage,
    slugify,
} from "./navHelpers.mts";
import type {
    DocContentItem,
    DocHeadingItem,
    DocPage,
    NavSection,
    NavStructure,
    NavTreePage,
    RawNavStructure,
} from "./navTypes.ts";

/** Minimal page object with a title and contents array. */
function makePage(title: string, contents: DocContentItem[] = []): DocPage {
    return { title, contents, route: "" };
}

/** Shorthand for a heading content item. */
function heading(value: string, level: number, route = "") {
    return { tag: "heading" as const, value, level, route };
}

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

    it("should convert section pages with bare strings and untagged groups", () => {
        const raw: RawNavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "components",
                        pages: ["buttons", { group: "Overlays", pages: ["dialog", "popover"] }],
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
                    { type: "group", group: "Overlays", pages: ["dialog", "popover"] },
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

describe("buildRouteMap", () => {
    it("should compute flat routes for a package with direct pages", () => {
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
        const routeMap = buildRouteMap(navConfig);

        expect(routeMap.get("core")).toBe("core");
        expect(routeMap.get("getting-started")).toBe("core/getting-started");
        expect(routeMap.get("reading-list")).toBe("core/reading-list");
    });

    it("should compute nested routes through sections and heading groups", () => {
        const navConfig: NavStructure = [
            {
                package: "core",
                pages: [],
                sections: [
                    {
                        section: "components",
                        pages: [
                            { type: "page", ref: "buttons" },
                            { type: "group", group: "Overlays", pages: ["dialog", "popover"] },
                        ],
                    },
                ],
            },
        ];
        const routeMap = buildRouteMap(navConfig);

        expect(routeMap.get("components")).toBe("core/components");
        expect(routeMap.get("buttons")).toBe("core/components/buttons");
        // Heading group pages share the section route
        expect(routeMap.get("dialog")).toBe("core/components/dialog");
        expect(routeMap.get("popover")).toBe("core/components/popover");
    });
});

describe("fixPageRoutes", () => {
    it("should set page.route and heading routes from the route map", () => {
        const pages: Record<string, DocPage> = {
            buttons: makePage("Buttons", [heading("Buttons", 1), heading("Usage", 2), "Some text content"]),
        };
        const routeMap = new Map([["buttons", "core/components/buttons"]]);

        fixPageRoutes(pages, routeMap);

        expect(pages.buttons.route).toBe("core/components/buttons");
        // Level 1 heading gets the page route
        expect((pages.buttons.contents[0] as DocHeadingItem).route).toBe("core/components/buttons");
        // Level 2 heading gets slugified sub-route
        expect((pages.buttons.contents[1] as DocHeadingItem).route).toBe("core/components/buttons.usage");
    });

    it("should skip pages not present in the route map", () => {
        const pages: Record<string, DocPage> = {
            _nav: makePage("Nav", [heading("Internal", 1)]),
        };
        const routeMap = new Map<string, string>();

        fixPageRoutes(pages, routeMap);

        // route should remain unchanged (original empty string from makePage)
        expect(pages._nav.route).toBe("");
    });
});

describe("slugify", () => {
    it("should lowercase and replace non-alphanumeric chars with hyphens", () => {
        expect(slugify("Hello World!")).toBe("hello-world-");
        expect(slugify("Date & Time Pickers")).toBe("date---time-pickers");
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
        const routeMap = buildRouteMap(navConfig);

        const tree = buildNavTree(navConfig, pages, routeMap);

        expect(tree).toHaveLength(1);
        expect(tree[0].reference).toBe("core");
        expect(tree[0].level).toBe(1);
        expect(tree[0].children).toHaveLength(1);
        expect((tree[0].children[0] as NavTreePage).reference).toBe("overview");
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
        const routeMap = buildRouteMap(navConfig);

        const tree = buildNavTree(navConfig, pages, routeMap);

        const sectionNode = tree[0].children[0] as NavTreePage;
        expect(sectionNode.reference).toBe("components");
        expect(sectionNode.level).toBe(2);
        expect((sectionNode.children[0] as NavTreePage).reference).toBe("buttons");
        expect(sectionNode.children[0].level).toBe(3);
    });
});

describe("buildSectionNode", () => {
    it("should build a section node with leaf page children", () => {
        const pages: Record<string, DocPage> = {
            components: makePage("Components"),
            buttons: makePage("Buttons"),
            dialog: makePage("Dialog"),
        };
        const routeMap = new Map([
            ["components", "core/components"],
            ["buttons", "core/components/buttons"],
            ["dialog", "core/components/dialog"],
        ]);
        const section: NavSection = {
            section: "components",
            pages: [
                { type: "page", ref: "buttons" },
                { type: "page", ref: "dialog" },
            ],
        };

        const node = buildSectionNode(section, 2, pages, routeMap);

        expect(node.reference).toBe("components");
        expect(node.level).toBe(2);
        expect(node.children).toHaveLength(2);
        expect((node.children[0] as NavTreePage).reference).toBe("buttons");
        expect((node.children[1] as NavTreePage).reference).toBe("dialog");
    });

    it("should include heading group nodes when they match page headings", () => {
        const pages: Record<string, DocPage> = {
            components: makePage("Components", [
                heading("Components", 1),
                heading("Overlays", 2, "core/components.overlays"),
            ]),
            dialog: makePage("Dialog"),
        };
        const routeMap = new Map([
            ["components", "core/components"],
            ["dialog", "core/components/dialog"],
        ]);
        const section: NavSection = {
            section: "components",
            pages: [{ type: "group", group: "Overlays", pages: ["dialog"] }],
        };

        const node = buildSectionNode(section, 2, pages, routeMap);

        // First child should be the matched heading node, second is the leaf page
        expect(node.children).toHaveLength(2);
        expect(node.children[0].title).toBe("Overlays");
        expect((node.children[1] as NavTreePage).reference).toBe("dialog");
    });
});

describe("buildLeafPageNode", () => {
    it("should build a leaf node with heading children extracted from page contents", () => {
        const pages: Record<string, DocPage> = {
            buttons: makePage("Buttons", [
                heading("Buttons", 1),
                heading("Usage", 2, "core/components/buttons.usage"),
                heading("Props", 2, "core/components/buttons.props"),
            ]),
        };
        const routeMap = new Map([["buttons", "core/components/buttons"]]);

        const node = buildLeafPageNode("buttons", 3, pages, routeMap);

        expect(node.reference).toBe("buttons");
        expect(node.level).toBe(3);
        // Should have 2 heading children (level 1 is skipped)
        expect(node.children).toHaveLength(2);
        expect(node.children[0].title).toBe("Usage");
        expect(node.children[1].title).toBe("Props");
    });

    it("should produce an empty children array for a page with no level-2+ headings", () => {
        const pages: Record<string, DocPage> = {
            overview: makePage("Overview", [heading("Overview", 1), "Some text"]),
        };
        const routeMap = new Map([["overview", "core/overview"]]);

        const node = buildLeafPageNode("overview", 2, pages, routeMap);

        expect(node.children).toHaveLength(0);
    });
});

describe("buildPageNodeFromChildren", () => {
    it("should assemble a PageNode with the correct shape", () => {
        const pages: Record<string, DocPage> = {
            buttons: makePage("Buttons"),
        };
        const routeMap = new Map([["buttons", "core/components/buttons"]]);
        const children = [{ title: "Usage", level: 4, route: "core/components/buttons.usage" }];

        const node = buildPageNodeFromChildren("buttons", 3, pages, routeMap, children);

        expect(node).toEqual({
            children,
            level: 3,
            reference: "buttons",
            route: "core/components/buttons",
            title: "Buttons",
        });
    });

    it("should use the route from routeMap for the node", () => {
        const pages: Record<string, DocPage> = {
            core: makePage("Core"),
        };
        const routeMap = new Map([["core", "core"]]);

        const node = buildPageNodeFromChildren("core", 1, pages, routeMap, []);

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
        expect(() => requirePage("nonexistent", {})).toThrow(
            '[docs-data] nav.json references page "nonexistent" which does not exist in docs.pages',
        );
    });
});

describe("extractHeadingChildren", () => {
    it("should extract level-2+ headings with adjusted levels", () => {
        const page = makePage("Components", [
            heading("Components", 1),
            heading("Usage", 2, "components.usage"),
            heading("Details", 3, "components.details"),
        ]);

        // pageNavLevel=2 means levelOffset=1, so heading levels are shifted by +1
        const result = extractHeadingChildren(page, 2);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ title: "Usage", level: 3, route: "components.usage" });
        expect(result[1]).toEqual({ title: "Details", level: 4, route: "components.details" });
    });

    it("should skip level-1 headings and non-heading content items", () => {
        const page = makePage("Buttons", [
            heading("Buttons", 1),
            "Some plain text",
            { tag: "code", value: "example" },
            null,
        ]);

        const result = extractHeadingChildren(page, 1);

        expect(result).toHaveLength(0);
    });
});
