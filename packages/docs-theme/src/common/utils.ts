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

import { Utils } from "@blueprintjs/core";
import { IHeadingNode, IPageNode, isPageNode } from "documentalist/dist/client";
import * as React from "react";

/**
 * Removes leading indents from a template string without removing all leading whitespace.
 * Trims resulting string to remove blank first/last lines caused by ` location.
 */
export function dedent(strings: TemplateStringsArray, ...values: Array<{ toString(): string }>) {
    let fullString = strings.reduce((accumulator, str, i) => {
        return accumulator + values[i - 1].toString() + str;
    });

    // match all leading spaces/tabs at the start of each line
    const match = fullString.match(/^[ \t]*(?=\S)/gm)!;
    // find the smallest indent, we don't want to remove all leading whitespace
    const indent = Math.min(...match.map(el => el.length));
    const regexp = new RegExp("^[ \\t]{" + indent + "}", "gm");
    fullString = indent > 0 ? fullString.replace(regexp, "") : fullString;
    return fullString.trim();
}

export function smartSearch(query: string, ...content: string[]) {
    const terms = query.toLowerCase().split(" ");
    const dataToSearch = content.map(s => s.toLowerCase());
    return terms.every(term => dataToSearch.some(d => d.indexOf(term) >= 0));
}

export interface IKeyEventMap {
    /** event handler invoked on all events */
    all?: React.KeyboardEventHandler<HTMLElement>;

    /** map keycodes to specific event handlers */
    [keyCode: number]: React.KeyboardEventHandler<HTMLElement>;
}

export function createKeyEventHandler(actions: IKeyEventMap, preventDefault = false) {
    return (e: React.KeyboardEvent<HTMLElement>) => {
        for (const k of Object.keys(actions)) {
            const key = Number(k);
            if (e.which === key) {
                if (preventDefault) {
                    e.preventDefault();
                }
                actions[key](e);
            }
        }
        Utils.safeInvoke(actions.all, e);
    };
}

/**
 * Performs an in-order traversal of the layout tree, invoking the callback for each node.
 * Callback receives an array of ancestors with direct parent first in the list.
 */
export function eachLayoutNode(
    layout: Array<IHeadingNode | IPageNode>,
    callback: (node: IHeadingNode | IPageNode, parents: IPageNode[]) => void,
    parents: IPageNode[] = [],
) {
    layout.forEach(node => {
        callback(node, parents);
        if (isPageNode(node)) {
            eachLayoutNode(node.children, callback, [node, ...parents]);
        }
    });
}
