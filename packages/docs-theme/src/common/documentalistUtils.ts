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

import type * as PageTree from "./pageTreeTypes";

/**
 * Performs an in-order traversal of the PageTree, invoking the callback for each
 * Item or Folder node (separators are skipped).
 * Callback receives an array of ancestor Folders with direct parent first in the list.
 */
export function eachLayoutNode(
    nodes: PageTree.Node[],
    callback: (node: PageTree.Item | PageTree.Folder, parents: PageTree.Folder[]) => void,
    parents: PageTree.Folder[] = [],
) {
    for (const node of nodes) {
        if (node.type === "separator") continue;
        callback(node, parents);
        if (node.type === "folder") {
            eachLayoutNode(node.children, callback, [node, ...parents]);
        }
    }
}
