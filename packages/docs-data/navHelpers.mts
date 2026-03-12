/**
 * @license Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import type {
    DocContentItem,
    DocHeadingItem,
    DocPage,
    NavPageRef,
    NavSection,
    NavStructure,
    NavTreeHeading,
    NavTreeNode,
    NavTreePage,
    RawNavStructure,
} from "./navTypes.ts";

function pageRef(ref: string): NavPageRef {
    return { type: "page", ref };
}

/**
 * Convert raw nav.json data (bare strings) into a fully
 * typed {@link NavStructure} with union items.
 */
export function normalizeNavConfig(raw: RawNavStructure): NavStructure {
    return raw.map(entry => ({
        package: entry.package,
        pages: entry.pages.map(pageRef),
        sections: entry.sections?.map(section => ({
            section: section.section,
            pages: section.pages.map(pageRef),
        })),
    }));
}

/**
 * Walk the hierarchical nav config to compute the full route for every page reference.
 */
export function buildRouteMap(navConfig: NavStructure): Map<string, string> {
    const routeMap = new Map<string, string>();

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

    function addRoute(ref: string, parentRoute: string): string {
        const route = parentRoute ? `${parentRoute}/${ref}` : ref;
        if (routeMap.has(ref)) {
            throw new Error(
                `[docs-data] duplicate nav ref "${ref}" (route "${route}" conflicts with "${routeMap.get(ref)}")`,
            );
        }
        routeMap.set(ref, route);
        return route;
    }
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
 * Replaces "&" with "and", lowercases, replaces non-alphanumeric chars with hyphens,
 * collapses consecutive hyphens, and trims leading/trailing hyphens.
 */
export function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * Build the full nav tree from nav.json and page data.
 */
export function buildNavTree(navConfig: NavStructure, pages: Record<string, DocPage>): NavTreePage[] {
    return navConfig.map(entry => {
        const packageRoute = entry.package;
        const packageChildren = [
            ...entry.pages.map(pageRef => buildNavLeafPage(pageRef.ref, 2, `${packageRoute}/${pageRef.ref}`, pages)),
            ...(entry.sections ?? []).map(section => {
                const sectionRoute = `${packageRoute}/${section.section}`;
                return buildNavSection(section, 2, sectionRoute, pages);
            }),
        ];
        return buildNavPage(entry.package, 1, packageRoute, pages, packageChildren);
    });
}

/**
 * Build a PageNode for a section containing child pages.
 */
export function buildNavSection(
    section: NavSection,
    level: number,
    route: string,
    pages: Record<string, DocPage>,
): NavTreePage {
    const childLevel = level + 1;
    const children: NavTreeNode[] = section.pages.map(child =>
        buildNavLeafPage(child.ref, childLevel, `${route}/${child.ref}`, pages),
    );

    const page = pages[section.section];
    if (page !== undefined) {
        return buildNavPage(section.section, level, route, pages, children);
    }

    // Section has no backing page — use section name as title
    return {
        type: "page",
        children,
        level,
        reference: section.section,
        route,
        title: section.section,
    };
}

/**
 * Build a PageNode for a leaf page (no nav children, only content headings).
 */
export function buildNavLeafPage(
    ref: string,
    level: number,
    route: string,
    pages: Record<string, DocPage>,
): NavTreePage {
    const headingChildren = extractHeadingChildren(requirePage(ref, pages), level);
    return buildNavPage(ref, level, route, pages, headingChildren);
}

/**
 * Assemble a PageNode from a ref and pre-built children array.
 */
export function buildNavPage(
    ref: string,
    level: number,
    route: string,
    pages: Record<string, DocPage>,
    children: NavTreeNode[],
): NavTreePage {
    const page = requirePage(ref, pages);
    return {
        type: "page",
        children,
        level,
        reference: ref,
        route,
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
                type: "heading",
                title: item.value,
                level: item.level + levelOffset,
                route: item.route,
            });
        }
    }

    return result;
}
