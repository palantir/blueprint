/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
            return (
                <h3>
                    <code>{ex.message}</code>
                </h3>
            );
        }
    });
}
