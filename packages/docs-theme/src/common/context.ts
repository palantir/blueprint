/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Utils } from "@blueprintjs/core";
import { IBlock, IKssPluginData, IMarkdownPluginData, ITypescriptPluginData } from "documentalist/dist/client";

/**
 * Gonna use React context to pass some helpful functions around.
 * This is basically the pauper's Redux store connector: some central state from the root
 * `Documentation` component is exposed to its children so those in the know can speak
 * directly to their parent.
 */
export interface IDocumentationContext {
    getDocsData(): IMarkdownPluginData & (ITypescriptPluginData | {}) & (IKssPluginData | {});

    /** Render a block of Documentalist documentation to a React node. */
    renderBlock(block: IBlock): React.ReactNode;

    /** Render a Documentalist type string to a React node. */
    renderType(type: string): React.ReactNode;
}

export const DocumentationContextTypes: React.ValidationMap<IDocumentationContext> = {
    getDocsData: assertFunctionProp,
    renderBlock: assertFunctionProp,
    renderType: assertFunctionProp,
};

function assertFunctionProp<T>(obj: T, key: keyof T) {
    if (obj[key] != null && Utils.isFunction(obj[key])) {
        return undefined;
    }
    return new Error(`[Blueprint] Documentation context ${key} must be function.`);
}
