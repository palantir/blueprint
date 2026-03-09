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

// Raw types to match nav.json

export interface RawNavHeadingGroup {
    group: string;
    pages: string[];
}

export type RawNavSectionItem = string | RawNavHeadingGroup;

export interface RawNavSection {
    section: Section;
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

export interface NavHeadingGroup {
    type: "group";
    group: string;
    pages: string[];
}

export type NavSectionItem = NavPageRef | NavHeadingGroup;

export interface NavSection {
    section: Section;
    pages: NavSectionItem[];
}

export interface NavPackageEntry {
    package: Package;
    pages: NavPageRef[];
    sections?: NavSection[];
}

export type NavStructure = NavPackageEntry[];
