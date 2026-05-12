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
export const PACKAGES = ["blueprint", "core", "datetime", "icons", "select", "table", "labs"] as const;
export type Package = (typeof PACKAGES)[number];

/**
 * Known section identifiers within packages.
 * Sections contain child pages and create a route segment
 * (e.g. "components" -> core/components/buttons).
 */
export const SECTIONS = ["components", "context", "hooks", "form-controls", "form-inputs", "overlays"] as const;
export type Section = (typeof SECTIONS)[number];

// "Raw" types come directly from nav.json

export type RawNavSectionItem = string;

export interface RawNavSection {
    section: Section;
    /**
     * Optional override for the URL prefix applied to child page routes.
     * When set, children are routed as `${package}/${routeAlias}/${page}`
     * instead of `${package}/${section}/${page}`. Used to preserve URL
     * stability when a section is split out of an existing parent (e.g.
     * `overlays` aliasing back to `components`).
     */
    routeAlias?: Section;
    pages: RawNavSectionItem[];
}

export interface RawNavPackageEntry {
    package: Package;
    pages: string[];
    sections?: RawNavSection[];
}

export type RawNavStructure = RawNavPackageEntry[];

// Normalized types

export interface NavPageRef {
    type: "page";
    ref: string;
}

export interface NavSection {
    section: Section;
    routeAlias?: Section;
    pages: NavPageRef[];
}

export interface NavPackageEntry {
    package: Package;
    pages: NavPageRef[];
    sections?: NavSection[];
}

export type NavStructure = NavPackageEntry[];

// Doc page types

export interface DocHeadingItem {
    tag: "heading";
    value: string;
    level: number;
    route: string;
}

export type DocContentItem = DocHeadingItem | string | null | { tag: string; value: string };

export interface DocPage {
    title: string;
    route: string;
    contents: DocContentItem[];
}

/** Fields common to all nav tree nodes. */
interface NavTreeNodeBase {
    title: string;
    level: number;
    route: string | undefined;
}

/** A content heading extracted from a page (no children, no reference). */
export interface NavTreeHeading extends NavTreeNodeBase {
    type: "heading";
}

/** A page or section node in the nav tree. */
export interface NavTreePage extends NavTreeNodeBase {
    type: "page";
    reference: string;
    children: NavTreeNode[];
}

/** Any node in the assembled nav tree. */
export type NavTreeNode = NavTreePage | NavTreeHeading;
