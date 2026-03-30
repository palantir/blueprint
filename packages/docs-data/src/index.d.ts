/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import { MarkdownPluginData, KssPluginData, TypescriptPluginData } from "@documentalist/client";

export type DocsCompleteData = MarkdownPluginData & KssPluginData & TypescriptPluginData;

export const docsData: DocsCompleteData;

export { PACKAGES, SECTIONS } from "../navTypes.mts";
export type { Package, Section } from "../navTypes.mts";

export interface NpmPackageInfo {
    name: string;
    version: string;
    versions: string[];
    nextVersion?: string;
}

export type NpmData = Record<string, NpmPackageInfo>;

export const npmData: NpmData;

export interface HeadingNode {
    route: string;
    level: number;
    title: string;
}

export interface PageNode extends HeadingNode {
    children: Array<PageNode | HeadingNode>;
    reference: string;
}
