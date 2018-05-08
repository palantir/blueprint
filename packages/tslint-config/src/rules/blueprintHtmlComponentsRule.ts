/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as ts from "typescript";

const PATTERN = /^(h[1-6]|code|pre|blockquote|table)$/;

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "blueprint-html-components",
        // tslint:disable-next-line:object-literal-sort-keys
        description: "Enforce usage of Blueprint components over JSX intrinsic elements.",
        options: null,
        optionsDescription: "Not configurable",
        optionExamples: ["true"],
        type: "style",
        typescriptOnly: false,
    };

    public static getFailure(componentName: string) {
        return `use Blueprint <${componentName}> component instead of JSX intrinsic element.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            const match = PATTERN.exec(node.tagName.getFullText());
            if (match != null) {
                const name = match[1].charAt(0).toUpperCase() + match[1].slice(1);
                ctx.addFailureAt(node.tagName.getFullStart(), node.tagName.getFullWidth(), Rule.getFailure(name));
            }
        }
        return ts.forEachChild(node, cb);
    });
}
