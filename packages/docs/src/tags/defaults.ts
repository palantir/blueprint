/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as tags from "./";

import { IKssPluginData, IMarkdownPluginData, ITypescriptPluginData } from "documentalist/dist/client";

export interface IDocsData extends IKssPluginData, IMarkdownPluginData, ITypescriptPluginData {
}

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
