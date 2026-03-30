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

import type { Block } from "@documentalist/client";
import classNames from "classnames";
import { createElement, useContext } from "react";

import { Classes, Code, H3 } from "@blueprintjs/core";

import { DocumentationContext } from "../common/context";
import type { TagRendererMap } from "../tags";

import { PropsTable } from "./propsTable";

const INTERFACE_TABLE_RE = /<InterfaceTable\s+name="([^"]+)"\s*\/>/g;

export function renderBlock(
    /** the block to render */
    block: Block | undefined,
    /** known tag renderers */
    tagRenderers: TagRendererMap,
    /** class names to apply to element wrapping string content. */
    textClassName?: string,
): React.JSX.Element | null {
    if (block === undefined) {
        return null;
    }
    const textClasses = classNames(Classes.RUNNING_TEXT, textClassName);
    const contents = block.contents.map((node, i) => {
        if (typeof node === "string") {
            if (INTERFACE_TABLE_RE.test(node)) {
                // Reset lastIndex after test()
                INTERFACE_TABLE_RE.lastIndex = 0;
                return <StringWithInterfaceTables key={i} html={node} textClassName={textClasses} />;
            }
            return <div className={textClasses} key={i} dangerouslySetInnerHTML={{ __html: node }} />;
        }
        try {
            const renderer = tagRenderers[node.tag];
            if (renderer === undefined) {
                throw new Error(`Unknown @tag: ${node.tag}`);
            }
            return createElement(renderer, { ...node, key: i });
        } catch (ex: any) {
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

/**
 * Renders a string node that contains one or more `<InterfaceTable name="..." />`
 * elements by splitting the HTML into segments and replacing matches with
 * React-rendered PropsTable components.
 */
function StringWithInterfaceTables({ html, textClassName }: { html: string; textClassName: string }) {
    const { getPropsRegistry } = useContext(DocumentationContext);
    const registry = getPropsRegistry?.();
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    INTERFACE_TABLE_RE.lastIndex = 0;
    while ((match = INTERFACE_TABLE_RE.exec(html)) !== null) {
        // Add any HTML before this match
        if (match.index > lastIndex) {
            const preceding = html.slice(lastIndex, match.index);
            segments.push(
                <div
                    className={textClassName}
                    key={`html-${lastIndex}`}
                    dangerouslySetInnerHTML={{ __html: preceding }}
                />,
            );
        }

        const name = match[1]!;
        const info = registry?.[name];
        if (info != null) {
            segments.push(<PropsTable key={`props-${name}`} {...info} />);
        } else {
            segments.push(
                <H3 key={`missing-${name}`}>
                    <Code>InterfaceTable: &quot;{name}&quot; not found in propsRegistry</Code>
                </H3>,
            );
        }

        lastIndex = match.index + match[0].length;
    }

    // Add any remaining HTML after the last match
    if (lastIndex < html.length) {
        const remaining = html.slice(lastIndex);
        segments.push(
            <div
                className={textClassName}
                key={`html-${lastIndex}`}
                dangerouslySetInnerHTML={{ __html: remaining }}
            />,
        );
    }

    return <>{segments}</>;
}
