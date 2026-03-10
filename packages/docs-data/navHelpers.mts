/**
 * @license Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import type {
    DocContentItem,
    DocHeadingItem,
    DocPage,
    NavSection,
    NavStructure,
    NavTreeHeading,
    NavTreeNode,
    NavTreePage,
    RawNavStructure,
} from "./navTypes.ts";

/**
 * Convert raw nav.json data (bare strings) into a fully
 * typed {@link NavStructure} with union items.
 */
export function normalizeNavConfig(raw: RawNavStructure): NavStructure {
    return raw.map(entry => ({
        package: entry.package,
        pages: entry.pages.map(ref => ({ type: "page" as const, ref })),
        sections: entry.sections?.map(section => ({
            section: section.section,
            pages: section.pages.map(ref => ({ type: "page" as const, ref })),
        })),
    }));
}

/**
 * Walk the hierarchical nav config to compute the full route for every page reference.
 */
export function buildRouteMap(navConfig: NavStructure): Map<string, string> {
    const routeMap = new Map<string, string>();

    function addRoute(ref: string, parentRoute: string): string {
        const route = parentRoute ? `${parentRoute}/${ref}` : ref;
        if (routeMap.has(ref)) {
            console.warn(`[docs-data] duplicate nav ref "${ref}" (route "${route}" overwrites "${routeMap.get(ref)}")`);
        }
        routeMap.set(ref, route);
        return route;
    }

    for (const entry of navConfig) {
        const packageRoute = addRoute(entry.package, "");

        for (const pageRef of entry.pages) {
            addRoute(pageRef.ref, packageRoute);
        }

        for (const section of entry.sections ?? []) {
            const sectionRoute = addRoute(section.section, packageRoute);

            for (const child of section.pages) {
                addRoute(child.ref, sectionRoute);
            }
        }
    }

    return routeMap;
}

/**
 * Fix routes in every page and its content heading objects.
 * Without @page tags, documentalist produces empty heading routes,
 * so we reconstruct them from the page route and heading value.
 */
export function fixPageRoutes(pages: Record<string, DocPage>, routeMap: Map<string, string>): void {
    for (const [ref, page] of Object.entries(pages)) {
        const correctRoute = routeMap.get(ref);
        if (correctRoute === undefined) {
            // Page not in nav config (e.g. _nav) — leave as-is
            continue;
        }

        page.route = correctRoute;

        // Reconstruct heading routes in page.contents
        for (const item of page.contents) {
            if (isHeading(item)) {
                if (item.level === 1) {
                    // Level 1 heading = page title, route is the page route
                    item.route = correctRoute;
                } else {
                    // Level 2+ headings: pageRoute.slugified-heading-value
                    item.route = correctRoute + "." + slugify(item.value);
                }
            }
        }
    }
}

/** Type guard for heading content items. */
function isHeading(item: DocContentItem): item is DocHeadingItem {
    return typeof item === "object" && item !== null && "tag" in item && item.tag === "heading";
}

/**
 * Convert a heading value to a URL-friendly slug.
 * Hand-rolled to match documentalist's slugification: lowercase, replace non-[a-z0-9-] with hyphens.
 * N.B. this does not collapse consecutive hyphens or trim edges — keep in sync if documentalist changes.
 */
export function slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

/**
 * Build the full nav tree from nav.json and page data.
 */
export function buildNavTree(
    navConfig: NavStructure,
    pages: Record<string, DocPage>,
    routeMap: Map<string, string>,
): NavTreePage[] {
    return navConfig.map(entry => {
        const packageChildren = [
            ...entry.pages.map(pageRef => buildLeafPageNode(pageRef.ref, 2, pages, routeMap)),
            ...(entry.sections ?? []).map(section => buildSectionNode(section, 2, pages, routeMap)),
        ];
        return buildPageNodeFromChildren(entry.package, 1, pages, routeMap, packageChildren);
    });
}

/**
 * Build a PageNode for a section containing child pages.
 */
export function buildSectionNode(
    section: NavSection,
    level: number,
    pages: Record<string, DocPage>,
    routeMap: Map<string, string>,
): NavTreePage {
    const childLevel = level + 1;
    const children: NavTreeNode[] = section.pages.map(child =>
        buildLeafPageNode(child.ref, childLevel, pages, routeMap),
    );

    const page = pages[section.section];
    if (page !== undefined) {
        return buildPageNodeFromChildren(section.section, level, pages, routeMap, children);
    }

    // Section has no backing page — use section name as title
    return {
        children,
        level,
        reference: section.section,
        route: routeMap.get(section.section),
        title: section.section,
    };
}

/**
 * Build a PageNode for a leaf page (no nav children, only content headings).
 */
export function buildLeafPageNode(
    ref: string,
    level: number,
    pages: Record<string, DocPage>,
    routeMap: Map<string, string>,
): NavTreePage {
    const headingChildren = extractHeadingChildren(requirePage(ref, pages), level);
    return buildPageNodeFromChildren(ref, level, pages, routeMap, headingChildren);
}

/**
 * Assemble a PageNode from a ref and pre-built children array.
 */
export function buildPageNodeFromChildren(
    ref: string,
    level: number,
    pages: Record<string, DocPage>,
    routeMap: Map<string, string>,
    children: NavTreeNode[],
): NavTreePage {
    const page = requirePage(ref, pages);
    return {
        children,
        level,
        reference: ref,
        route: routeMap.get(ref),
        title: page.title,
    };
}

/**
 * Look up a page by reference, throwing if not found.
 */
export function requirePage(ref: string, pages: Record<string, DocPage>): DocPage {
    const page = pages[ref];
    if (page === undefined) {
        throw new Error(`[docs-data] nav.json references page "${ref}" which does not exist in docs.pages`);
    }
    return page;
}

/**
 * Extract heading nodes from page contents for the nav tree.
 * Skips level-1 headings (the page title). Adjusts heading levels
 * relative to the page's position in the nav tree.
 */
export function extractHeadingChildren(page: DocPage, pageNavLevel: number): NavTreeHeading[] {
    const levelOffset = pageNavLevel - 1;
    const result: NavTreeHeading[] = [];

    for (const item of page.contents) {
        if (isHeading(item) && item.level >= 2) {
            result.push({
                title: item.value,
                level: item.level + levelOffset,
                route: item.route,
            });
        }
    }

    return result;
}
