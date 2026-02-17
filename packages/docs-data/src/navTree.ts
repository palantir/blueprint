/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import navConfig from "../nav.json";

import type { HeadingNode, PageNode, PageRegistryEntry } from "./types";

// ---------------------------------------------------------------------------
// Nav tree builder
// ---------------------------------------------------------------------------

/**
 * Build the full navigation tree from nav.json and the page registry.
 * This is intended to be called once at app startup.
 */
export function buildNavigation(registry: Record<string, PageRegistryEntry>): Array<PageNode | HeadingNode> {
    const nav = navConfig as Record<string, unknown>;
    const topLevel = nav["_nav"] as string[];
    return topLevel.map(ref => buildPageNode(ref, 1, nav, registry));
}

function buildPageNode(
    ref: string,
    level: number,
    nav: Record<string, unknown>,
    registry: Record<string, PageRegistryEntry>,
): PageNode {
    const entry = registry[ref];
    const title = entry?.title ?? ref;
    const route = entry?.route ?? ref;
    const navChildren = (nav[ref] as Array<string | { heading: string }>) ?? [];
    const hasHeadingMarkers = navChildren.some(c => typeof c === "object");

    // Extract heading children from the page registry (h2+ headings)
    const headingChildren = getHeadingChildren(entry, route, level);

    let children: Array<PageNode | HeadingNode>;

    if (hasHeadingMarkers) {
        // Interleaved mode: nav.json entries mix page refs and heading markers
        const headingsByTitle = new Map<string, HeadingNode>();
        for (const h of headingChildren) {
            headingsByTitle.set(h.title, h);
        }

        children = [];
        for (const child of navChildren) {
            if (typeof child === "string") {
                children.push(buildPageNode(child, level + 1, nav, registry));
            } else if (child.heading) {
                const matched = headingsByTitle.get(child.heading);
                if (matched) {
                    children.push(matched);
                }
            }
        }
    } else {
        // Default mode: headings first, then page children
        const pageChildren = navChildren
            .filter((c): c is string => typeof c === "string")
            .map(childRef => buildPageNode(childRef, level + 1, nav, registry));
        children = [...headingChildren, ...pageChildren];
    }

    return { reference: ref, route, title, level, children };
}

function getHeadingChildren(
    entry: PageRegistryEntry | undefined,
    pageRoute: string,
    pageNavLevel: number,
): HeadingNode[] {
    if (!entry?.headings) {
        return [];
    }

    const levelOffset = pageNavLevel - 1;
    return entry.headings
        .filter(h => h.level >= 2)
        .map(h => ({
            title: h.title,
            route: `${pageRoute}.${h.slug}`,
            level: h.level + levelOffset,
        }));
}
