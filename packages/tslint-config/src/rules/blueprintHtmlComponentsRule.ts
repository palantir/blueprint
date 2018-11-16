/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import { addImportToFile } from "./utils/addImportToFile";
import { replaceTagName } from "./utils/replaceTagName";

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
    const tagFailures: Array<{
        jsxTag: ts.JsxTagNameExpression;
        newTagName: string;
        replacements: Lint.Replacement[];
    }> = [];

    // walk file and build up array of failures
    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            const match = PATTERN.exec(node.tagName.getFullText());
            if (match != null) {
                const newTagName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
                const replacements = [replaceTagName(node.tagName, newTagName)];

                if (ts.isJsxOpeningElement(node)) {
                    // find closing tag after this opening tag to replace both in one failure
                    const [closingNode] = node.parent!.getChildren().filter(ts.isJsxClosingElement);
                    replacements.push(replaceTagName(closingNode.tagName, newTagName));
                }

                tagFailures.push({ jsxTag: node.tagName, newTagName, replacements });
            }
        }
        return ts.forEachChild(node, cb);
    });

    if (tagFailures.length === 0) {
        return;
    }

    // collect all potential new imports into one replacement (in first failure), after processing entire file.
    const importsToAdd = addImportToFile(ctx.sourceFile, tagFailures.map(m => m.newTagName), "@blueprintjs/core");
    tagFailures[0].replacements.push(importsToAdd);

    // add all failures at the end
    tagFailures.forEach(({ jsxTag, newTagName, replacements }) =>
        ctx.addFailureAt(jsxTag.getFullStart(), jsxTag.getFullWidth(), Rule.getFailure(newTagName), replacements),
    );
}
