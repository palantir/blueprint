/**
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 */

/**
 * Known Blueprint documentation packages.
 * Each maps to a top-level section in the sidebar.
 */
export type Package = "blueprint" | "core" | "datetime" | "icons" | "select" | "table" | "labs";

/**
 * Known section identifiers within packages.
 * Sections are pages that also contain child pages and create a route segment
 * (e.g. "components" -> core/components/buttons).
 */
export type Section = "components" | "context" | "hooks";

/**
 * A non-routable visual heading that groups related pages in the sidebar.
 * Rendered as a non-clickable divider/label. Does NOT create a route segment.
 */
export interface NavHeadingGroup {
    /** Display label for the heading (purely visual, not a route). */
    heading: string;
    /** Ordered list of page references displayed under this heading. */
    pages: string[];
}

/**
 * Ordered contents of a section: bare page-ref strings and heading groups,
 * in sidebar display order.
 */
export type NavSectionChildren = Array<string | NavHeadingGroup>;

/**
 * A routable sub-section within a package. Both a page (own content/route)
 * and a container for child pages.
 */
export interface NavSection {
    section: Section;
    children: NavSectionChildren;
}

/**
 * A top-level package entry in the navigation.
 * `pages` lists direct child pages (rendered first).
 * `sections` lists sub-sections (rendered after pages).
 */
export interface NavPackageEntry {
    package: Package;
    pages: string[];
    sections?: NavSection[];
}

/** The root nav structure -- an ordered array of package entries. */
export type NavStructure = NavPackageEntry[];
