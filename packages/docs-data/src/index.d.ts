/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import {
    INpmPluginData,
    IMarkdownPluginData,
    IKssExample,
    IKssPluginData,
    ITypescriptPluginData,
} from "@documentalist/client";

export type DocsCompleteData = IMarkdownPluginData & INpmPluginData & IKssPluginData & ITypescriptPluginData;

export const docsData: DocsCompleteData;
