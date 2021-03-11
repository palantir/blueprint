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

import { IHeadingNode, IPageNode, isPageNode } from "@documentalist/client";

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
