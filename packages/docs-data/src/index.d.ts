/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import { NpmPluginData, MarkdownPluginData, KssPluginData, TypescriptPluginData } from "@documentalist/client";

export type DocsCompleteData = MarkdownPluginData & NpmPluginData & KssPluginData & TypescriptPluginData;

export const docsData: DocsCompleteData;

export interface NpmPackageInfo {
    name: string;
    version: string;
    versions: string[];
}

export type NpmData = Record<string, NpmPackageInfo>;

export const npmData: NpmData;
