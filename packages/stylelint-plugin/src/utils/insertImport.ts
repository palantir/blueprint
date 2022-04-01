/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import postcss, { AtRule, Comment, Root } from "postcss";
import type { PluginContext } from "stylelint";

/**
 * Adds an import statement to the file. The import is inserted below the existing imports, and if there are
 * no imports present then it's inserted at the top of the file (but below any copyright headers).
 */
export function insertImport(root: Root, context: PluginContext, importPath: string): void {
    const newline: string = (context as any).newline || "\n";
    const ruleOrComment = getLastImport(root) || getCopyrightHeader(root);
    if (ruleOrComment != null) {
        const importNode = postcss.atRule({
            name: "import",
            params: `"${importPath}"`,
            raws: {
                afterName: " ",
                before: ruleOrComment.type === "comment" ? `${newline}${newline}` : newline,
                semicolon: true,
            },
        });
        root.insertAfter(ruleOrComment, importNode);
    } else {
        const importNode = postcss.atRule({
            name: "import",
            params: `"${importPath}"`,
            raws: {
                afterName: " ",
                before: "",
                semicolon: true,
            },
        });
        root.prepend(importNode);
        // Make sure there are at least two newlines before the next child
        const nextChild = root.nodes?.[1];
        if (nextChild != null) {
            const nExistingNewlines = nextChild.raws.before?.split("")?.filter(char => char === newline).length ?? 0;
            nextChild.raws.before = `${newline.repeat(Math.max(0, 2 - nExistingNewlines))}${
                nextChild.raws.before || ""
            }`;
        }
    }
}

/**
 * Returns the last import node in the file, or undefined if one does not exist
 */
function getLastImport(root: Root): AtRule | undefined {
    let lastImport: AtRule | undefined;
    root.walkAtRules(/^import$/i, atRule => {
        lastImport = atRule;
    });
    return lastImport;
}

/**
 * Returns the first copyright header in the file, or undefined if one does not exist
 */
function getCopyrightHeader(root: Root): Comment | undefined {
    let copyrightComment: Comment | undefined;
    root.walkComments(comment => {
        if (comment.text.toLowerCase().includes("copyright")) {
            copyrightComment = comment;
            return false; // Stop the iteration
        }
        return;
    });
    return copyrightComment;
}
