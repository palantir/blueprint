/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as utils from "tsutils";
import * as ts from "typescript";
import { addImportToFile } from "./utils/addImportToFile";

const BLUEPRINT_CLASSNAME_PATTERN = /[^\w-<.](pt-[\w-]+)/g;

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
                const classNameMatch = currentMatch[1]; // e.g. pt-breadcrumb
                // skip icon classes as they are handled by a separate rule.
                // tslint:disable-next-line:blueprint-classes-constants
                if (classNameMatch != null && !classNameMatch.startsWith("pt-icon")) {
                    ptMatches.push({ match: classNameMatch, index: currentMatch.index });
                }
            }

            if (ptMatches.length > 0) {
                const ptClassStrings = ptMatches.map(m => m.match);
                const replacementText = utils.isStringLiteral(node)
                    ? // "string literal" likely becomes `${template} string` so we may need to change how it is assigned
                      wrapForParent(getLiteralReplacement(node.getText(), ptClassStrings), node)
                    : getTemplateReplacement(node.getText(), ptClassStrings);

                const replacements = [new Lint.Replacement(node.getStart(), node.getWidth(), replacementText)];
                // add an import statement for `Classes` constants at most once.
                if (shouldFixImports) {
                    replacements.unshift(addImportToFile(ctx.sourceFile, ["Classes"], "@blueprintjs/core"));
                    shouldFixImports = false;
                }

                ctx.addFailureAt(
                    node.getFullStart() + ptMatches[0].index + 1,
                    ptMatches[0].match.length,
                    Rule.FAILURE_STRING,
                    replacements,
                );
            }
        }

        return ts.forEachChild(node, callback);
    }
}

/** Produce replacement text for a string literal that contains invalid classes. */
function getLiteralReplacement(className: string, ptClassStrings: string[]) {
    // remove all illegal classnames, then slice off the quotes, and trim any remaining white space
    const stringWithoutPtClasses = ptClassStrings
        .reduce((value, cssClass) => value.replace(cssClass, ""), className)
        .slice(1, -1)
        .trim();
    // special case: only one invalid class name
    if (stringWithoutPtClasses.length === 0 && ptClassStrings.length === 1) {
        return convertPtClassName(ptClassStrings[0]);
    }
    // otherwise produce a `template string`
    const templateStrings = ptClassStrings.map(n => `\${${convertPtClassName(n)}}`).join(" ");
    return `\`${[templateStrings, stringWithoutPtClasses].join(" ").trim()}\``;
}

/** Produce replacement text for a `template string` that contains invalid classes. */
function getTemplateReplacement(className: string, ptClassStrings: string[]) {
    return ptClassStrings.reduce(
        (value, cssClass) => value.replace(cssClass, `\${${convertPtClassName(cssClass)}}`),
        className,
    );
}

/** Wrap the given statement based on the type of the parent node: JSX props, expressions, etc. */
function wrapForParent(statement: string, node: ts.Node) {
    const { parent } = node;
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
