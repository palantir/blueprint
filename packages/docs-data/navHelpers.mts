/**
 * @license Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import type { NavSection, NavStructure, RawNavStructure } from "./navTypes.ts";

/**
 * Convert raw nav.json data (bare strings + untagged groups) into a fully
 * typed {@link NavStructure} with discriminated union items.
 *
 * This is the single parse boundary where `typeof` checks exist.
 */
export function normalizeNavConfig(raw: RawNavStructure): NavStructure {
    return raw.map(entry => ({
        package: entry.package,
        pages: entry.pages.map(ref => ({ type: "page" as const, ref })),
        sections: entry.sections?.map(section => ({
            section: section.section,
            pages: section.pages.map(item =>
                typeof item === "string" ? { type: "page" as const, ref: item } : { type: "group" as const, ...item },
            ),
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
                switch (child.type) {
                    case "page":
                        addRoute(child.ref, sectionRoute);
                        break;
                    case "group":
                        for (const pageRef of child.pages) {
                            addRoute(pageRef, sectionRoute);
                        }
                        break;
                }
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
export function fixPageRoutes(pages: Record<string, any>, routeMap: Map<string, string>): void {
    for (const [ref, page] of Object.entries(pages)) {
        const correctRoute = routeMap.get(ref);
        if (correctRoute === undefined) {
            // Page not in nav config (e.g. _nav) — leave as-is
            continue;
        }

        page.route = correctRoute;

        // Reconstruct heading routes in page.contents
        for (const item of page.contents) {
            if (typeof item === "object" && item !== null && item.tag === "heading") {
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
    pages: Record<string, any>,
    routeMap: Map<string, string>,
): any[] {
    return navConfig.map(entry => {
        const packageChildren = [
            ...entry.pages.map(pageRef => buildLeafPageNode(pageRef.ref, 2, pages, routeMap)),
            ...(entry.sections ?? []).map(section => buildSectionNode(section, 2, pages, routeMap)),
        ];
        return buildPageNodeFromChildren(entry.package, 1, pages, routeMap, packageChildren);
    });
}

/**
 * Build a PageNode for a section, which may contain bare pages and heading groups.
 */
export function buildSectionNode(
    section: NavSection,
    level: number,
    pages: Record<string, any>,
    routeMap: Map<string, string>,
): any {
    const childLevel = level + 1;
    const page = pages[section.section];
    const headingsByTitle = new Map<string, any>();
    for (const h of extractHeadingChildren(page, level)) {
        headingsByTitle.set(h.title, h);
    }

    const children: any[] = [];
    for (const child of section.pages) {
        switch (child.type) {
            case "page":
                children.push(buildLeafPageNode(child.ref, childLevel, pages, routeMap));
                break;
            case "group": {
                const matched = headingsByTitle.get(child.group);
                if (matched) {
                    children.push(matched);
                } else {
                    console.warn(
                        `[docs-data] nav.json group "${child.group}" not found in page "${section.section}" contents`,
                    );
                }
                for (const pageRef of child.pages) {
                    children.push(buildLeafPageNode(pageRef, childLevel, pages, routeMap));
                }
                break;
            }
        }
    }

    return buildPageNodeFromChildren(section.section, level, pages, routeMap, children);
}

/**
 * Build a PageNode for a leaf page (no nav children, only content headings).
 */
export function buildLeafPageNode(
    ref: string,
    level: number,
    pages: Record<string, any>,
    routeMap: Map<string, string>,
): any {
    const headingChildren = extractHeadingChildren(requirePage(ref, pages), level);
    return buildPageNodeFromChildren(ref, level, pages, routeMap, headingChildren);
}

/**
 * Assemble a PageNode from a ref and pre-built children array.
 */
export function buildPageNodeFromChildren(
    ref: string,
    level: number,
    pages: Record<string, any>,
    routeMap: Map<string, string>,
    children: any[],
): any {
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
export function requirePage(ref: string, pages: Record<string, any>): any {
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
export function extractHeadingChildren(page: any, pageNavLevel: number): any[] {
    const levelOffset = pageNavLevel - 1;
    const result: any[] = [];

    for (const item of page.contents) {
        if (typeof item === "object" && item !== null && item.tag === "heading" && item.level >= 2) {
            result.push({
                title: item.value,
                level: item.level + levelOffset,
                route: item.route,
            });
        }
    }

    return result;
}
