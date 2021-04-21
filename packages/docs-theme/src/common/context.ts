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

import {
    IBlock,
    IKssPluginData,
    IMarkdownPluginData,
    INpmPluginData,
    ITsDocBase,
    ITypescriptPluginData,
} from "@documentalist/client";
import React, { createContext } from "react";

/* eslint-disable @typescript-eslint/ban-types */
/** This docs theme requires Markdown data and optionally supports Typescript and KSS data. */
export type DocsData = IMarkdownPluginData &
    (ITypescriptPluginData | {}) &
    (IKssPluginData | {}) &
    (INpmPluginData | {});
/* eslint-enable @typescript-eslint/ban-types */

export function hasTypescriptData(docs: DocsData): docs is IMarkdownPluginData & ITypescriptPluginData {
    return docs != null && (docs as ITypescriptPluginData).typescript != null;
}

export function hasNpmData(docs: DocsData): docs is IMarkdownPluginData & INpmPluginData {
    return docs != null && (docs as INpmPluginData).npm != null;
}

export function hasKssData(docs: DocsData): docs is IMarkdownPluginData & IKssPluginData {
    return docs != null && (docs as IKssPluginData).css != null;
}

/**
 * Use React context to provide data and rendering functions from the root `Documentation`
 * component to other ancestor components defined by the docs-theme package.
 */
export interface DocumentationContextApi {
    /**
     * Get the Documentalist data.
     * Use the `hasTypescriptData` and `hasKssData` typeguards before accessing those plugins' data.
     */
    getDocsData: () => DocsData;

    /** Render a block of Documentalist documentation to a React node. */
    renderBlock: (block: IBlock) => React.ReactNode;

    /** Render a Documentalist Typescript type string to a React node. */
    renderType: (type: string) => React.ReactNode;

    /** Render the text of a "View source" link. */
    renderViewSourceLinkText: (entry: ITsDocBase) => React.ReactNode;

    /** Open the API browser to the given member name. */
    showApiDocs: (name: string) => void;
}

export const DocumentationContext = createContext<DocumentationContextApi>({
    getDocsData: () => ({} as DocsData),
    renderBlock: (_block: IBlock) => undefined,
    renderType: (type: string) => type,
    renderViewSourceLinkText: (entry: ITsDocBase) => entry.sourceUrl,
    showApiDocs: () => void 0,
});
