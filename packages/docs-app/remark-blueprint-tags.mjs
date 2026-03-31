/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

// @ts-check

import { visit } from "unist-util-visit";

/**
 * Remark plugin that transforms `@tagName value` paragraphs into
 * `<BlueprintTag tag="tagName" value="value" />` JSX elements.
 *
 * This runs in the @mdx-js/loader pipeline so that existing Documentalist
 * @tag syntax (e.g. @reactExample, @interface, @css, @method, @see,
 * @reactDocs, @reactCodeExample) works without manual conversion.
 */
const TAG_RE = /^@(\w+)\s+(.+)$/;

export default function remarkBlueprintTags() {
    return tree => {
        visit(tree, "paragraph", (node, index, parent) => {
            // A paragraph with a single text child that matches @tag value
            if (node.children.length === 1 && node.children[0].type === "text") {
                const match = TAG_RE.exec(node.children[0].value.trim());
                if (match) {
                    const [, tag, value] = match;
                    /** @type {any} */
                    const jsxNode = {
                        type: "mdxJsxFlowElement",
                        name: "BlueprintTag",
                        attributes: [
                            {
                                type: "mdxJsxAttribute",
                                name: "tag",
                                value: tag,
                            },
                            {
                                type: "mdxJsxAttribute",
                                name: "value",
                                value: value,
                            },
                        ],
                        children: [],
                        data: { _mdxExplicitJsx: true },
                    };
                    parent.children[index] = jsxNode;
                }
            }
        });
    };
}
