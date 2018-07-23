/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as ts from "typescript";

// detect "pt-" *prefix*: not preceded by letter or dash
const PATTERN = /[^\w-<]pt-[\w-]+/;

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "blueprint-classes-constants",
        // tslint:disable-next-line:object-literal-sort-keys
        description: "Enforce usage of Classes constants over namespaced string literals.",
        options: null,
        optionsDescription: "Not configurable",
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };

    public static FAILURE_STRING = "use Blueprint `Classes` constant instead of string literal";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (ts.isStringLiteralLike(node) || ts.isTemplateExpression(node)) {
            const match = PATTERN.exec(node.getFullText());
            if (match != null) {
                // ignore first character of match: negated character class
                ctx.addFailureAt(node.getFullStart() + match.index + 1, match[0].length - 1, Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
