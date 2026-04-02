/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import { KssPluginData, TypescriptPluginData } from "@documentalist/client";

import type { DocPage, NavTreeNode } from "../navTypes.mts";

export interface MdxPluginData {
    nav: NavTreeNode[];
    pages: Record<string, DocPage>;
}

export type DocsCompleteData = MdxPluginData & KssPluginData & TypescriptPluginData;

export const docsData: DocsCompleteData;

export { PACKAGES, SECTIONS } from "../navTypes.mts";
export { slugify } from "../navHelpers.mts";
export type { DocPage, NavTreeHeading, NavTreeNode, NavTreePage, Package, Section } from "../navTypes.mts";

export interface NpmPackageInfo {
    name: string;
    version: string;
    versions: string[];
    nextVersion?: string;
}

export type NpmData = Record<string, NpmPackageInfo>;

export const npmData: NpmData;
