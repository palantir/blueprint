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

import { createContext, type ReactNode } from "react";

import type { HeadingNode, PageNode, PageRegistryEntry } from "@blueprintjs/docs-data/src/types";

export interface DocsData {
    nav: Array<PageNode | HeadingNode>;
    pages: Record<string, PageRegistryEntry>;
}

/**
 * Use React context to provide data and rendering functions from the root `Documentation`
 * component to other ancestor components defined by the docs-theme package.
 */
export interface DocumentationContextApi {
    getDocsData: () => any;

    /** Render a block of documentation to a React node. */
    renderBlock: (block: any) => ReactNode;

    /** Render a Typescript type string to a React node. */
    renderType: (type: string) => ReactNode;

    /** Render the text of a "View source" link. */
    renderViewSourceLinkText: (entry: any) => ReactNode;

    /** Open the API browser to the given member name. */
    showApiDocs: (name: string) => void;
}

export const DocumentationContext = createContext<DocumentationContextApi>({
    getDocsData: () => ({}),
    renderBlock: () => null,
    renderType: (type: string) => type,
    renderViewSourceLinkText: () => "View source",
    showApiDocs: () => void 0,
});
