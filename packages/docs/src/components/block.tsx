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
