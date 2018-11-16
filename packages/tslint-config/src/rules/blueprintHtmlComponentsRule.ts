/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as ts from "typescript";
import { addImportToFile } from "./utils/addImportToFile";

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
    const matches: Array<{
        tagName: ts.JsxTagNameExpression;
        newTagName: string;
        closingTag?: ts.JsxTagNameExpression;
    }> = [];
    ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            // const closingTag = ts.isJsxOpeningElement(node) ? node.parent!.getChildren()
            const match = PATTERN.exec(node.tagName.getFullText());
            if (match != null) {
                let closingTag;
                if (ts.isJsxOpeningElement(node)) {
                    const siblings = node.parent!.getChildren();
                    closingTag = (siblings[siblings.length - 1] as ts.JsxClosingElement).tagName;
                }
                const newTagName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
                matches.push({ tagName: node.tagName, newTagName, closingTag });
            }
        }
        return ts.forEachChild(node, cb);
    });

    const importsToAdd = addImportToFile(ctx.sourceFile, matches.map(m => m.newTagName), "@blueprintjs/core");
    matches.forEach(({ tagName, newTagName, closingTag }, i) => {
        const replacements = [new Lint.Replacement(tagName.getFullStart(), tagName.getFullWidth(), newTagName)];
        if (closingTag) {
            replacements.push(new Lint.Replacement(closingTag.getFullStart(), closingTag.getFullWidth(), newTagName));
        }
        if (i === 0) {
            replacements.push(importsToAdd);
        }
        ctx.addFailureAt(tagName.getFullStart(), tagName.getFullWidth(), Rule.getFailure(newTagName), replacements);
    });
}
