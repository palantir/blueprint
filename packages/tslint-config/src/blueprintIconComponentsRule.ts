/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as Lint from "tslint";
import * as ts from "typescript";

const OPTION_COMPONENT = "component";
const OPTION_ENUM = "enum";

export class Rule extends Lint.Rules.AbstractRule {
    // tslint:disable:object-literal-sort-keys
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "blueprint-icon-components",
        description: "Enforce usage of JSX Icon components over IconName string literals (or vice-versa)",
        options: {
            type: "array",
            items: [{ enum: [OPTION_COMPONENT, OPTION_ENUM], type: "string" }],
            minLength: 1,
            maxLength: 1,
        },
        optionsDescription: Lint.Utils.dedent`
            One of the following two options must be provided:
            * \`"${OPTION_COMPONENT}"\` requires JSX Icon components for \`icon\` props.
            * \`"${OPTION_ENUM}"\` requires \`IconName\` string literals for \`icon\` props.`,
        optionExamples: [`[true, "${OPTION_COMPONENT}"]`, `[true, "${OPTION_ENUM}"]`],
        type: "functionality",
        typescriptOnly: false,
    };
    // tslint:enable:object-literal-sort-keys

    public static COMPONENT_MESSAGE = "use <NameIcon /> component for icon prop";
    public static ENUM_MESSAGE = "use IconName string literal for icon prop";

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
            } else if (ts.isJsxExpression(initializer) && option === OPTION_ENUM) {
                ctx.addFailureAt(node.getStart(ctx.sourceFile), node.getWidth(ctx.sourceFile), Rule.ENUM_MESSAGE);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
