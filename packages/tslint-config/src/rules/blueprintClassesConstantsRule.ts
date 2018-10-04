/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as utils from "tsutils";
import * as ts from "typescript";
import { addImportToFile } from "./utils/addImportToFile";

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

interface IMatchingString {
    match: string;
    index: number;
}

function walk(ctx: Lint.WalkContext<void>) {
    let shouldFixImports = true;
    return ts.forEachChild(ctx.sourceFile, callback);

    function callback(node: ts.Node): void {
        if (ts.isStringLiteralLike(node) || ts.isTemplateExpression(node)) {
            const ptMatches: IMatchingString[] = [];
            const fullText = node.getFullText();
            let currentMatch: RegExpExecArray | null;
            // tslint:disable-next-line:no-conditional-assignment
            while ((currentMatch = BLUEPRINT_CLASSNAME_PATTERN.exec(fullText)) != null) {
                const fullBlueprintName = currentMatch[1]; // e.g. pt-breadcrumb
                const blueprintClassName = getBlueprintClassName(fullBlueprintName); // e.g. breadcrumb

                // See if we should ignore this class or not.
                if (blueprintClassName == null || shouldIgnoreBlueprintClass(blueprintClassName)) {
                    continue;
                } else {
                    ptMatches.push({ match: fullBlueprintName, index: currentMatch.index });
                }
            }
            if (ptMatches.length > 0) {
                ctx.addFailureAt(
                    node.getFullStart() + ptMatches[0].index + 1,
                    ptMatches[0].match.length,
                    Rule.FAILURE_STRING,
                    getReplacement(node, ptMatches.map(p => p.match), ctx.sourceFile, shouldFixImports),
                );
                shouldFixImports = false;
            }
        }

        return ts.forEachChild(node, callback);
    }
}

function getReplacement(
    node: ts.StringLiteralLike | ts.TemplateExpression,
    ptClassStrings: string[],
    file: ts.SourceFile,
    shouldFixImport: boolean,
) {
    const replacements: Lint.Replacement[] = [];

    // We may need to add a blueprint import to the top of the file. We only want to do this once per file, otherwise,
    // we'll keep stacking imports and mess things up.
    if (shouldFixImport) {
        replacements.push(addImportToFile(file, ["Classes"], "@blueprintjs/core"));
    }

    if (utils.isStringLiteral(node)) {
        // remove all illegal classnames, then slice off the quotes, and trim any remaining white space
        replacements.push(
            new Lint.Replacement(
                node.getStart(),
                node.getWidth(),
                wrapForParent(getLiteralReplacement(node, ptClassStrings), node),
            ),
        );
    } else if (utils.isTemplateExpression(node) || utils.isNoSubstitutionTemplateLiteral(node)) {
        let replacementText = node.getText();
        ptClassStrings.forEach(classString => {
            const classReplacement = `\${${convertPtClassName(classString)}}`;
            replacementText = replacementText.replace(classString, classReplacement);
        });
        replacements.push(new Lint.Replacement(node.getStart(), node.getWidth(), replacementText));
    }
    return replacements;
}

/** Produce replacement text for a string literal that may contain invalid classes. */
function getLiteralReplacement(node: ts.StringLiteral, ptClassStrings: string[]) {
    // remove all illegal classnames, then slice off the quotes, and trim any remaining white space
    const stringWithoutPtClasses = ptClassStrings
        .reduce((value, cssClass) => value.replace(cssClass, ""), node.getText())
        .slice(1, -1)
        .trim();
    // special case: only one invalid class name.
    if (stringWithoutPtClasses.length === 0 && ptClassStrings.length === 1) {
        return convertPtClassName(ptClassStrings[0]);
    }
    // otherwise produce a `template string`
    const templateStrings = ptClassStrings.map(n => `\${${convertPtClassName(n)}}`).join(" ");
    return `\`${[templateStrings, stringWithoutPtClasses].join(" ").trim()}\``;
}

/** Wrap the given statement based on the type of the parent node: JSX props, expressions, etc. */
function wrapForParent(statement: string, node: ts.Node) {
    const parent = node.parent;
    if (parent === undefined) {
        return statement;
    } else if (utils.isJsxAttribute(parent)) {
        return `{${statement}}`;
    } else if (utils.isExpressionStatement(parent)) {
        return `[${statement}]`;
        // If we're changing the key, it will be child index 0 and we need to wrap it.
        // Else, we're changing a value, and there's no need to wrap
    } else if (utils.isPropertyAssignment(parent) && parent.getChildAt(0) === node) {
        return `[${statement}]`;
    } else {
        return statement;
    }
}

/** Converts a `pt-class-name` literal to `Classes.CLASS_NAME` constant. */
function convertPtClassName(text: string) {
    const className = text
        .replace("pt-", "")
        .replace(/-/g, "_")
        .toUpperCase();
    return `Classes.${className}`;
}

const BLUEPRINT_CLASSNAME_PATTERN = /[^\w-<.](pt-[\w-]+)/g;

function getBlueprintClassName(fullClassName: string): string | undefined {
    if (fullClassName.length < 3) {
        return undefined;
    } else {
        return fullClassName.slice(3);
    }
}

function shouldIgnoreBlueprintClass(blueprintClassName: string): boolean {
    return blueprintClassName.startsWith("icon");
}
