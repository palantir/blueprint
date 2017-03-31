/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IPageData, StringOrTag } from "documentalist/dist/client";
import * as React from "react";

import { ITagRendererMap, TagElement } from "../tags";

export function renderContentsBlock(
    contents: StringOrTag[],
    tagRenderers: ITagRendererMap,
    page?: IPageData,
): TagElement[] {
    return contents.map((node, i) => {
        if (typeof node === "string") {
            return <div className="docs-section pt-running-text" dangerouslySetInnerHTML={{ __html: node }} key={i} />;
        }
        try {
            const renderer = tagRenderers[node.tag];
            if (renderer === undefined) {
                throw new Error(`Unknown @tag: ${node.tag}`);
            }
            return renderer(node, i, tagRenderers, page);
        } catch (ex) {
            console.error(ex.message);
            return <h3><code>{ex.message}</code></h3>;
        }
    });
}
