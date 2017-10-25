/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
