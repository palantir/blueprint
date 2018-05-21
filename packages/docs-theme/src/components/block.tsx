/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Code, H3 } from "@blueprintjs/core";
import classNames from "classnames";
import { IBlock } from "documentalist/dist/client";
import * as React from "react";
import { ITagRendererMap } from "../tags";

export function renderBlock(
    /** the block to render */
    block: IBlock | undefined,
    /** known tag renderers */
    tagRenderers: ITagRendererMap,
    /** class names to apply to element wrapping string content. */
    textClassName?: string,
): JSX.Element | null {
    if (block === undefined) {
        return null;
    }
    const textClasses = classNames(Classes.RUNNING_TEXT, textClassName);
    const contents = block.contents.map((node, i) => {
        if (typeof node === "string") {
            return <div className={textClasses} key={i} dangerouslySetInnerHTML={{ __html: node }} />;
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
                <H3 key={`__error-${i}`}>
                    <Code>{ex.message}</Code>
                </H3>
            );
        }
    });
    return <div className="docs-section">{contents}</div>;
}
