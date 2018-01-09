/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import * as tags from "./";

import { IKssPluginData, IMarkdownPluginData, ITag, ITypescriptPluginData } from "documentalist/dist/client";

export interface IDocsData extends IKssPluginData, IMarkdownPluginData, ITypescriptPluginData {}

export function createDefaultRenderers(): Record<string, React.SFC<ITag>> {
    return {
        css: tags.CssExample,
        heading: tags.Heading,
        interface: tags.TypescriptExample,
        page: () => null,
        // TODO: @see
    };
}
