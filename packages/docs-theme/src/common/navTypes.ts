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
 * Nav tree types used by docs-theme components.
 *
 * These mirror the types in `@blueprintjs/docs-data/navTypes.mts` but are
 * defined here to avoid a circular dependency (docs-data depends on docs-theme).
 */

/** Fields common to all nav tree nodes. */
interface NavTreeNodeBase {
    title: string;
    level: number;
    route: string;
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

/** A compiled documentation page. */
export interface DocPage {
    title: string;
    route: string;
    contents: unknown[];
    metadata: Record<string, any>;
    sourcePath: string;
}

/** Data shape provided by the MDX documentation pipeline (replaces MarkdownPluginData). */
export interface MdxPluginData {
    nav: NavTreeNode[];
    pages: Record<string, DocPage>;
}
