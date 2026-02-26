/**
 * @license Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Nav-related helper functions extracted from compile-docs-data.mjs
 */

// @ts-check

/**
 * Walk the hierarchical nav config to compute the full route for every page reference.
 *
 * @param {import("./navTypes.d.ts").NavStructure} navConfig
 * @returns {Map<string, string>}
 */
export function buildRouteMap(navConfig) {
    /** @type {Map<string, string>} */
    const routeMap = new Map();

    /**
     * @param {string} ref
     * @param {string} parentRoute
     */
    function addRoute(ref, parentRoute) {
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
            addRoute(pageRef, packageRoute);
        }

        for (const section of entry.sections ?? []) {
            const sectionRoute = addRoute(section.section, packageRoute);

            for (const child of section.pages) {
                if (typeof child === "string") {
                    addRoute(child, sectionRoute);
                } else {
                    // NavHeadingGroup — pages within the group share the section route
                    for (const pageRef of child.pages) {
                        addRoute(pageRef, sectionRoute);
                    }
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
 *
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 */
export function fixPageRoutes(pages, routeMap) {
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
 *
 * @param {string} value
 * @returns {string}
 */
export function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

/**
 * Build the full nav tree from nav.json and page data.
 *
 * @param {import("./navTypes.d.ts").NavStructure} navConfig
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @returns {any[]}
 */
export function buildNavTree(navConfig, pages, routeMap) {
    return navConfig.map(entry => {
        const packageChildren = [
            ...entry.pages.map(ref => buildLeafPageNode(ref, 2, pages, routeMap)),
            ...(entry.sections ?? []).map(section => buildSectionNode(section, 2, pages, routeMap)),
        ];
        return buildPageNodeFromChildren(entry.package, 1, pages, routeMap, packageChildren);
    });
}

/**
 * Build a PageNode for a section, which may contain bare pages and heading groups.
 *
 * @param {import("./navTypes.d.ts").NavSection} section
 * @param {number} level
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @returns {any}
 */
export function buildSectionNode(section, level, pages, routeMap) {
    const childLevel = level + 1;
    const page = pages[section.section];
    const headingsByTitle = new Map();
    for (const h of extractHeadingChildren(page, level)) {
        headingsByTitle.set(h.title, h);
    }

    /** @type {any[]} */
    const children = [];
    for (const child of section.pages) {
        if (typeof child === "string") {
            children.push(buildLeafPageNode(child, childLevel, pages, routeMap));
        } else {
            // NavHeadingGroup — emit the heading node, then its pages
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
        }
    }

    return buildPageNodeFromChildren(section.section, level, pages, routeMap, children);
}

/**
 * Build a PageNode for a leaf page (no nav children, only content headings).
 *
 * @param {string} ref
 * @param {number} level
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @returns {any}
 */
export function buildLeafPageNode(ref, level, pages, routeMap) {
    const headingChildren = extractHeadingChildren(requirePage(ref, pages), level);
    return buildPageNodeFromChildren(ref, level, pages, routeMap, headingChildren);
}

/**
 * Assemble a PageNode from a ref and pre-built children array.
 *
 * @param {string} ref
 * @param {number} level
 * @param {Record<string, any>} pages
 * @param {Map<string, string>} routeMap
 * @param {any[]} children
 * @returns {any}
 */
export function buildPageNodeFromChildren(ref, level, pages, routeMap, children) {
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
 *
 * @param {string} ref
 * @param {Record<string, any>} pages
 * @returns {any}
 */
export function requirePage(ref, pages) {
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
 *
 * @param {any} page
 * @param {number} pageNavLevel
 * @returns {any[]}
 */
export function extractHeadingChildren(page, pageNavLevel) {
    const levelOffset = pageNavLevel - 1;
    /** @type {any[]} */
    const result = [];

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
