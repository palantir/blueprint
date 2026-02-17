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

import type { ComponentType, LazyExoticComponent } from "react";

export interface PageRegistryEntry {
    component: LazyExoticComponent<ComponentType>;
    title: string;
    route: string;
    sourcePath: string;
    metadata: Record<string, unknown>;
    headings: Array<{ title: string; slug: string; level: number }>;
}

export interface PageNode {
    reference: string;
    route: string;
    title: string;
    level: number;
    children: Array<PageNode | HeadingNode>;
}

export interface HeadingNode {
    route: string;
    title: string;
    level: number;
}

export function isPageNode(node: PageNode | HeadingNode): node is PageNode {
    return "children" in node && "reference" in node;
}

export interface NpmPackageInfo {
    name: string;
    version: string;
    /** Pre-release version, if available. */
    nextVersion?: string;
    /** All known major versions (used for version switcher). */
    versions: string[];
}
