/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Utils } from "@blueprintjs/core";
import {
    IBlock,
    IKssPluginData,
    IMarkdownPluginData,
    INpmPluginData,
    ITsDocBase,
    ITypescriptPluginData,
} from "documentalist/dist/client";

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

/**
 * Use React context to transparently provide helpful functions to children.
 * This is basically the pauper's Redux store connector: some central state from the root
 * `Documentation` component is exposed to its children so those in the know can speak
 * directly to their parent.
 */
export interface IDocumentationContext {
    /**
     * Get the Documentalist data.
     * Use the `hasTypescriptData` and `hasKssData` typeguards before accessing those plugins' data.
     */
    getDocsData(): IDocsData;

    /** Render a block of Documentalist documentation to a React node. */
    renderBlock(block: IBlock): React.ReactNode;

    /** Render a Documentalist Typescript type string to a React node. */
    renderType(type: string): React.ReactNode;

    /** Render the text of a "View source" link. */
    renderViewSourceLinkText(entry: ITsDocBase): React.ReactNode;

    /** Open the API browser to the given member name. */
    showApiDocs(name: string): void;
}

/**
 * To enable context access in a React component, assign `static contextTypes` and declare `context` type:
 *
 * ```tsx
 * export class ContextComponent extends React.PureComponent<IApiLinkProps> {
 *     public static contextTypes = DocumentationContextTypes;
 *     public context: IDocumentationContext;
 *
 *     public render() {
 *         return this.context.renderBlock(this.props.block);
 *     }
 * }
 * ```
 *
 * NOTE: This does not reference prop-types to avoid copious "cannot be named" errors.
 */
export const DocumentationContextTypes = {
    getDocsData: assertFunctionProp,
    renderBlock: assertFunctionProp,
    renderType: assertFunctionProp,
    renderViewSourceLinkText: assertFunctionProp,
    showApiDocs: assertFunctionProp,
};

// simple alternative to prop-types dependency
function assertFunctionProp<T>(obj: T, key: keyof T) {
    if (obj[key] != null && Utils.isFunction(obj[key])) {
        return undefined;
    }
    return new Error(`[Blueprint] Documentation context ${key} must be function.`);
}
