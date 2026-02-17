/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import type { HeadingNode, PageNode, PageRegistryEntry } from "@blueprintjs/docs-data/src/types";
import { createContext, type ReactNode } from "react";

/** Documentation data needed by the theme. */
export interface DocsData {
    nav: Array<PageNode | HeadingNode>;
    pages: Record<string, PageRegistryEntry>;
    npm?: Record<string, { name: string; version: string }>;
}

/**
 * Use React context to provide data and rendering functions from the root `Documentation`
 * component to other ancestor components defined by the docs-theme package.
 */
export interface DocumentationContextApi {
    /** Get the documentation data. */
    getDocsData: () => DocsData;

    /** Render the text of a "View source" link. */
    renderViewSourceLinkText: (entry: { sourceUrl?: string; fileName?: string }) => ReactNode;

    /** Open the API browser to the given member name. */
    showApiDocs: (name: string) => void;
}

export const DocumentationContext = createContext<DocumentationContextApi>({
    getDocsData: () => ({ nav: [], pages: {} }),
    renderViewSourceLinkText: () => "View source",
    showApiDocs: () => void 0,
});
