/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    IBlock,
    IKssPluginData,
    IMarkdownPluginData,
    INpmPluginData,
    ITypescriptPluginData,
    linkify,
} from "documentalist/dist/client";
import React from "react";
import { IThemeConfig, withConfig } from "../../config";
import { renderBlock } from "../components/block";
import { ApiLink } from "../components/typescript/apiLink";

/** This docs theme requires Markdown data and optionally supports Typescript and KSS data. */
export type IDocsData = IMarkdownPluginData &
    (ITypescriptPluginData | {}) &
    (IKssPluginData | {}) &
    (INpmPluginData | {});

export function hasTypescriptData(docs: IDocsData): docs is IMarkdownPluginData & ITypescriptPluginData {
    return docs != null && (docs as ITypescriptPluginData).typescript != null;
}

export function hasNpmData(docs: IDocsData): docs is IMarkdownPluginData & INpmPluginData {
    return docs != null && (docs as INpmPluginData).npm != null;
}

export function hasKssData(docs: IDocsData): docs is IMarkdownPluginData & IKssPluginData {
    return docs != null && (docs as IKssPluginData).css != null;
}

export function withDocumentalist<P>(Type: React.ComponentType<P & IDocumentationContext>) {
    return withConfig<P>(props => {
        const { documentalist } = props;
        const context: IDocumentationContext = {
            documentalist,
            renderBlock: block => renderBlock(block, {}),
            renderType: hasTypescriptData(documentalist)
                ? type =>
                      linkify(type, documentalist.typescript, (name, _d, idx) => (
                          <ApiLink key={`${name}-${idx}`} name={name} onClick={null} />
                      ))
                : type => type,
            renderViewSourceLinkText: props.renderViewSourceLinkText ? props.renderViewSourceLinkText : e => e.name,
        };
        return <Type {...context} {...props} />;
    });
}

/**
 * Use React context to transparently provide helpful functions to children.
 * This is basically the pauper's Redux store connector: some central state from the root
 * `Documentation` component is exposed to its children so those in the know can speak
 * directly to their parent.
 */
export interface IDocumentationContext
    extends Required<Pick<IThemeConfig, "documentalist" | "renderViewSourceLinkText">> {
    /** Render a block of Documentalist documentation to a React node. */
    renderBlock(block: IBlock): React.ReactNode;

    /** Render a Documentalist Typescript type string to a React node. */
    renderType(type: string): React.ReactNode;
}
