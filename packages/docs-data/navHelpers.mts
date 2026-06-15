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
    Section,
} from "./navTypes.mts";

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
            routeAlias: section.routeAlias,
            pages: section.pages.map(pageRef),
        })),
    }));
}

/** Extract every page ref from a raw nav config (package names + flat pages + section pages). */
export function getPageRefs(raw: RawNavStructure): string[] {
    const refs: string[] = [];
    for (const entry of raw) {
        refs.push(entry.package);
        for (const page of entry.pages) {
            refs.push(page);
        }
        for (const section of entry.sections ?? []) {
            for (const page of section.pages) {
                refs.push(page);
            }
        }
    }
    return refs;
}

/** Extract all section names from a raw nav config. */
export function getSectionRefs(raw: RawNavStructure): Section[] {
    return raw.flatMap(entry => (entry.sections ?? []).map(s => s.section));
}

/**
 * Walk the nav config and assign the correct route to every page
 * and its content headings.
 */
export function assignRoutes(navConfig: NavStructure, pages: Record<string, DocPage>): void {
    const seen = new Set<string>();

    for (const entry of navConfig) {
        const packageRoute = entry.package;
        applyRoute(entry.package, packageRoute);

        for (const pageRef of entry.pages) {
            applyRoute(pageRef.ref, `${packageRoute}/${pageRef.ref}`);
        }

        for (const section of entry.sections ?? []) {
            const sectionRoute = `${packageRoute}/${section.section}`;
            applyRoute(section.section, sectionRoute);

            const childRoutePrefix = section.routeAlias ? `${packageRoute}/${section.routeAlias}` : sectionRoute;
            for (const child of section.pages) {
                applyRoute(child.ref, `${childRoutePrefix}/${child.ref}`);
            }
        }
    }

    function createSubheadingRoute(pageRoute: string, headingValue: string): string {
        return pageRoute + "." + slugify(headingValue);
    }

    function applyRoute(ref: string, route: string): void {
        if (seen.has(ref)) {
            throw new Error(`[docs-data] duplicate nav ref "${ref}" (route "${route}" conflicts)`);
        }
        seen.add(ref);

        const page = pages[ref];
        if (page === undefined) return;

        page.route = route;
        page.contents = extractHtmlHeadingsFromContents(page.contents);

        for (const item of page.contents) {
            if (isHeading(item)) {
                item.route = item.level === 1 ? route : createSubheadingRoute(route, item.value);
            }
        }
    }
}

/** Convert a kebab-case string to title case (e.g. "form-controls" → "Form Controls"). */
function kebabToTitleCase(str: string): string {
    return str
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
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
                const childRoutePrefix = section.routeAlias ? `${packageRoute}/${section.routeAlias}` : sectionRoute;
                return buildNavSection(section, 2, sectionRoute, childRoutePrefix, pages);
            }),
        ];
        return buildNavPage(entry.package, 1, packageRoute, pages, packageChildren);
    });
}

function pageRef(ref: string): NavPageRef {
    return { type: "page", ref };
}

/**
 * Build a PageNode for a section containing child pages.
 */
export function buildNavSection(
    section: NavSection,
    level: number,
    route: string,
    childRoutePrefix: string,
    pages: Record<string, DocPage>,
): NavTreePage {
    const childLevel = level + 1;
    const children: NavTreeNode[] = section.pages.map(child =>
        buildNavLeafPage(child.ref, childLevel, `${childRoutePrefix}/${child.ref}`, pages),
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
        title: kebabToTitleCase(section.section),
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

/**
 * Regex match #, ##, and ### as headings/subheadings that are shown in nav
 */
const HTML_HEADING_RE = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;

/**
 * Split HTML strings at heading boundaries, replacing <hN>...</hN> with
 * DocHeadingItem objects so the rest of the pipeline can process them.
 */
function extractHtmlHeadingsFromContents(contents: DocContentItem[]): DocContentItem[] {
    const result: DocContentItem[] = [];
    for (const item of contents) {
        if (typeof item !== "string") {
            result.push(item);
            continue;
        }
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        HTML_HEADING_RE.lastIndex = 0;
        while ((match = HTML_HEADING_RE.exec(item)) !== null) {
            const before = item.slice(lastIndex, match.index);
            if (before) result.push(before);
            const level = parseInt(match[1], 10);
            // Strip any nested HTML tags (e.g. <code>, <a>) to get plain text
            const value = match[2].replace(/<[^>]+>/g, "");
            result.push({ tag: "heading", level, value, route: "" });
            lastIndex = match.index + match[0].length;
        }
        const remaining = item.slice(lastIndex);
        if (remaining) result.push(remaining);
    }
    return result;
}
