/**
 * @license Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import type * as PageTree from "fumadocs-core/page-tree";

import type {
    DocContentItem,
    DocHeadingItem,
    DocPage,
    NavPageRef,
    NavSection,
    NavStructure,
    RawNavStructure,
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
            pages: section.pages.map(pageRef),
        })),
    }));
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

            for (const child of section.pages) {
                applyRoute(child.ref, `${sectionRoute}/${child.ref}`);
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
 * Build a fumadocs-core PageTree from the nav config and page data.
 */
export function buildPageTree(navConfig: NavStructure, pages: Record<string, DocPage>): PageTree.Root {
    const children: PageTree.Node[] = navConfig.map(entry => {
        const packageRoute = entry.package;
        const packagePage = pages[entry.package];

        const folderChildren: PageTree.Node[] = [
            ...entry.pages.map(ref => buildItem(ref.ref, `${packageRoute}/${ref.ref}`, pages)),
            ...(entry.sections ?? []).map(section => {
                const sectionRoute = `${packageRoute}/${section.section}`;
                return buildSectionFolder(section, sectionRoute, pages);
            }),
        ];

        return {
            type: "folder",
            name: packagePage?.title ?? kebabToTitleCase(entry.package),
            $id: packageRoute,
            index: packagePage
                ? { type: "page", name: packagePage.title, url: packageRoute, $id: packageRoute }
                : undefined,
            defaultOpen: false,
            children: folderChildren,
        } satisfies PageTree.Folder;
    });

    return { name: "Blueprint", children };
}

function buildSectionFolder(section: NavSection, route: string, pages: Record<string, DocPage>): PageTree.Folder {
    const sectionPage = pages[section.section];
    const children: PageTree.Node[] = section.pages.map(child => buildItem(child.ref, `${route}/${child.ref}`, pages));

    return {
        type: "folder",
        name: sectionPage?.title ?? kebabToTitleCase(section.section),
        $id: route,
        index: sectionPage ? { type: "page", name: sectionPage.title, url: route, $id: route } : undefined,
        defaultOpen: false,
        children,
    };
}

function buildItem(ref: string, route: string, pages: Record<string, DocPage>): PageTree.Item {
    const page = requirePage(ref, pages);
    return {
        type: "page",
        name: page.title,
        url: route,
        $id: ref,
    };
}

function pageRef(ref: string): NavPageRef {
    return { type: "page", ref };
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
