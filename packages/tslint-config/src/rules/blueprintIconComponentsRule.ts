/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as ts from "typescript";

const OPTION_COMPONENT = "component";
const OPTION_LITERAL = "literal";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "blueprint-icon-components",
        // tslint:disable-next-line:object-literal-sort-keys
        description: "Enforce usage of JSX Icon components over IconName string literals (or vice-versa)",
        options: {
            items: [{ enum: [OPTION_COMPONENT, OPTION_LITERAL], type: "string" }],
            maxLength: 1,
            minLength: 0,
            type: "array",
        },
        optionsDescription: Lint.Utils.dedent`
            Accepts one option which can be either of the following values:
            * \`"${OPTION_COMPONENT}"\` (default) requires JSX Icon components for \`icon\` props.
            * \`"${OPTION_LITERAL}"\` requires \`IconName\` string literals for \`icon\` props.`,
        optionExamples: [`true`, `false`, `[true, "${OPTION_COMPONENT}"]`, `[true, "${OPTION_LITERAL}"]`],
        type: "functionality",
        typescriptOnly: false,
    };

    public static COMPONENT_MESSAGE = "use <NamedIcon /> component for icon prop";
    public static LITERAL_MESSAGE = "use IconName string literal for icon prop";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const [option = OPTION_COMPONENT] = this.ruleArguments;
        return this.applyWithFunction(sourceFile, walk, option);
    }
}

function walk(ctx: Lint.WalkContext<string>): void {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (ts.isJsxAttribute(node) && node.name.text === "icon") {
            const { initializer } = node;
            const option = ctx.options;
            // TODO add fix argument
            if (ts.isStringLiteral(initializer) && option === OPTION_COMPONENT) {
                ctx.addFailureAt(node.getStart(ctx.sourceFile), node.getWidth(ctx.sourceFile), Rule.COMPONENT_MESSAGE);
            } else if (ts.isJsxExpression(initializer) && option === OPTION_LITERAL) {
                ctx.addFailureAt(node.getStart(ctx.sourceFile), node.getWidth(ctx.sourceFile), Rule.LITERAL_MESSAGE);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
