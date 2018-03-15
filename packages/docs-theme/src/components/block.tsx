/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import { IBlock } from "documentalist/dist/client";
import * as React from "react";
import { ITagRendererMap } from "../tags";

export function renderBlock(
    block: IBlock | undefined,
    tagRenderers: ITagRendererMap,
    className?: string,
): JSX.Element[] {
    if (block === undefined) {
        return [];
    }
    return block.contents.map((node, i) => {
        if (typeof node === "string") {
            return (
                <div
                    className={classNames("docs-section", className)}
                    dangerouslySetInnerHTML={{ __html: node }}
                    key={i}
                />
            );
        }
        try {
            const renderer = tagRenderers[node.tag];
            if (renderer === undefined) {
                throw new Error(`Unknown @tag: ${node.tag}`);
            }
            return React.createElement(renderer, { ...node, key: i });
        } catch (ex) {
            console.error(ex.message);
            return (
                <h3 key={`__error-${i}`}>
                    <code>{ex.message}</code>
                </h3>
            );
        }
    });
}
