/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
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

import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Return the top level node that is the greatest parent of the current node, if it is a Program.
 * Non-program top level parents return undefined.
 */
export function getProgram(node: TSESTree.BaseNode & { type: AST_NODE_TYPES }): TSESTree.Program | undefined {
    let curr = node;
    while (curr.parent != null) {
        curr = curr.parent;
    }
    if (curr.type === AST_NODE_TYPES.Program) {
        return curr as TSESTree.Program;
    }
    return undefined;
}
