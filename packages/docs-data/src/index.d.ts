/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import { NpmPluginData, MarkdownPluginData, KssPluginData, TypescriptPluginData } from "@documentalist/client";
import type * as PageTree from "fumadocs-core/page-tree";

export type DocsCompleteData = MarkdownPluginData &
    NpmPluginData &
    KssPluginData &
    TypescriptPluginData & {
        nav: PageTree.Node[];
    };

export const docsData: DocsCompleteData;

export { PACKAGES, SECTIONS } from "../navTypes.mts";
export type { Package, Section } from "../navTypes.mts";

export interface NpmPackageInfo {
    name: string;
    version: string;
    versions: string[];
}

export type NpmData = Record<string, NpmPackageInfo>;

export const npmData: NpmData;
