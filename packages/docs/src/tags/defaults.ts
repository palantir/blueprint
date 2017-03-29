import * as tags from "./";

import { IKssPluginData, IMarkdownPluginData, ITypescriptPluginData } from "documentalist/dist/plugins";

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
