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

import { CssSyntax } from "./cssSyntax";

/**
 * Adds an import statement to the file. The import is inserted below the existing imports, and if there are
 * no imports present then it's inserted at the top of the file (but below any copyright headers).
 */
export function insertImport(
    cssSyntaxType: CssSyntax.SASS | CssSyntax.LESS,
    root: Root,
    context: PluginContext,
    importPath: string,
    namespace?: string,
): void {
    const newline: string = (context as any).newline || "\n";
    const ruleOrComment = getLastImport(cssSyntaxType, root) || getCopyrightHeader(root);

    let importOrUse = "import";
    let params = `"${importPath}"`;
    if (cssSyntaxType === CssSyntax.SASS) {
        importOrUse = "use";
        if (namespace !== undefined) {
            params += ` as ${namespace}`;
        }
    }

    if (ruleOrComment != null) {
        const importNode = postcss.atRule({
            name: importOrUse,
            params,
            raws: {
                afterName: " ",
                before: ruleOrComment.type === "comment" ? `${newline}${newline}` : newline,
                semicolon: true,
            },
        });
        root.insertAfter(ruleOrComment, importNode);
    } else {
        const importNode = postcss.atRule({
            name: importOrUse,
            params,
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
function getLastImport(cssSyntaxType: CssSyntax.SASS | CssSyntax.LESS, root: Root): AtRule | undefined {
    let lastImport: AtRule | undefined;
    const walkRegex = cssSyntaxType === CssSyntax.LESS ? /^import$/i : /^use$/i;
    root.walkAtRules(walkRegex, atRule => {
        lastImport = atRule;
    });
    return lastImport;
}

/**
 * Returns the first copyright header in the file, or undefined if one does not exist.
 * If the first copyright header spans multiple lines, the last line is returned.
 */
function getCopyrightHeader(root: Root): Comment | undefined {
    let lastCopyrightComment: Comment | undefined;
    root.walkComments(comment => {
        if (lastCopyrightComment) {
            if (comment.source?.start === undefined || lastCopyrightComment.source?.end === undefined) {
                return false;
            }
            if (comment.source.start.line === lastCopyrightComment.source.end.line + 1) {
                // Copyright continues in next comment via //
                lastCopyrightComment = comment;
            } else {
                // The next comment is not directly under the prior comment
                return false;
            }
        } else if (comment.text.toLowerCase().includes("copyright")) {
            lastCopyrightComment = comment;
            if (comment.source?.start === undefined || comment.source?.end === undefined) {
                return false;
            }
            if (comment.source.start.line !== comment.source.end.line) {
                // A multi-line copyright comment such as /* */
                return false; // Stop the iteration
            }
        }
        return;
    });
    return lastCopyrightComment;
}
