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

const { Consumer: DocumentalistConsumer, Provider: DocumentalistProvider } = React.createContext<IDocsData>({
    nav: [],
    pages: {},
});
export { DocumentalistProvider };

export function withDocumentalist<P>(Type: React.ComponentType<P & IDocumentationContext>) {
    return (props: P) => {
        function render(docs: IDocsData) {
            const context: IDocumentationContext = {
                docs,
                renderBlock: block => renderBlock(block, {}),
                renderType: hasTypescriptData(docs)
                    ? type =>
                          linkify(type, docs.typescript, (name, _d, idx) => (
                              <ApiLink key={`${name}-${idx}`} name={name} onClick={null} />
                          ))
                    : type => type,
            };
            return <Type {...context} {...props} />;
        }
        return <DocumentalistConsumer>{render}</DocumentalistConsumer>;
    };
}

/**
 * Use React context to transparently provide helpful functions to children.
 * This is basically the pauper's Redux store connector: some central state from the root
 * `Documentation` component is exposed to its children so those in the know can speak
 * directly to their parent.
 */
export interface IDocumentationContext {
    docs: IDocsData;

    /** Render a block of Documentalist documentation to a React node. */
    renderBlock(block: IBlock): React.ReactNode;

    /** Render a Documentalist Typescript type string to a React node. */
    renderType(type: string): React.ReactNode;
}
