/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
 * Navigation item configuration (input format before build-time processing).
 * Used in nav.config.js to define the navigation structure.
 */
export interface NavItemConfig {
    /** Route/page ID (must match route defined in page content) */
    route: string;
    /** Display title for navigation */
    title: string;
    /** Nested child pages */
    children?: NavItemConfig[];
    /** NPM package name - version and npmLink are resolved at build time */
    packageName?: string;
}

/**
 * Navigation item in the documentation tree (output format after build-time processing).
 * Replaces HeadingNode and PageNode from @documentalist/client.
 */
export interface NavItem {
    /** Route/page ID */
    route: string;
    /** Display title for navigation */
    title: string;
    /** Nesting level (0 = root) */
    level: number;
    /** Nested child pages (empty array if leaf node) */
    children: NavItem[];
    /** Page reference (typically the route without parent prefix) */
    reference?: string;
    /** Package version (resolved at build time from packageName) */
    version?: string;
    /** Link to npm package page (resolved at build time from packageName) */
    npmLink?: string;
}

/**
 * Type guard to check if a nav item has children.
 * Replaces isPageNode() from @documentalist/client.
 */
export function hasChildren(item: NavItem): boolean {
    return item.children.length > 0;
}
