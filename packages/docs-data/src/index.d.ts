/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// TODO: delete this import once @documentalist/client dependency is fully removed
import { NpmPluginData, MarkdownPluginData, KssPluginData, TypescriptPluginData } from "@documentalist/client";

export type DocsCompleteData = MarkdownPluginData & NpmPluginData & KssPluginData & TypescriptPluginData;

export const docsData: DocsCompleteData;

export { PACKAGES, SECTIONS } from "../navTypes.mts";
export type { Package, Section } from "../navTypes.mts";
