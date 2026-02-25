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
 * A non-routable visual group that clusters related pages in the sidebar.
 * Rendered as a non-clickable divider/label. Does NOT create a route segment.
 */
export interface NavHeadingGroup {
    /** Display label for the group (purely visual, not a route). */
    group: string;
    /** Ordered list of page references displayed under this group. */
    pages: string[];
}

/**
 * Ordered contents of a section: bare page-ref strings and heading groups,
 * in sidebar display order.
 */
export type NavSectionPages = Array<string | NavHeadingGroup>;

/**
 * A routable sub-section within a package. Both a page (own content/route)
 * and a container for child pages.
 */
export interface NavSection {
    section: Section;
    pages: NavSectionPages;
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
