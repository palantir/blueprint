/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// TODO: delete this import once @documentalist/client dependency is fully removed
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

// Minimal types replacing "@documentalist/client"

export interface HeadingNode {
    route: string;
    level: number;
    title: string;
}

export interface PageNode extends HeadingNode {
    children: Array<PageNode | HeadingNode>;
    reference: string;
}

export function isPageNode(node: HeadingNode | PageNode): node is PageNode;
