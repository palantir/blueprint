/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as tags from "./";

import { IKssPluginData, IMarkdownPluginData, ITypescriptPluginData } from "documentalist/dist/client";

export interface IDocsData extends IKssPluginData, IMarkdownPluginData, ITypescriptPluginData {}

export function createDefaultRenderers(docs: IDocsData) {
    const css = new tags.CssTagRenderer(docs);
    const heading = new tags.HeadingTagRenderer();
    const iface = new tags.InterfaceTagRenderer(docs);
    const page = new tags.PageTagRenderer();

    return {
        css: css.render,
        heading: heading.render,
        interface: iface.render,
        page: page.render,
    };
}
