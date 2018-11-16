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
            * \`"${OPTION_LITERAL}"\` requires \`IconName\` string literals for \`icon\` props.
            A fixer is available for \`"${OPTION_COMPONENT}"\` that converts a string literal to the corresponding component.`,
        optionExamples: [`true`, `false`, `[true, "${OPTION_COMPONENT}"]`, `[true, "${OPTION_LITERAL}"]`],
        type: "functionality",
        typescriptOnly: false,
    };

    public static componentMessage = (component: string) => `Replace icon literal with component: ${component}`;
    public static literalMessage = (literal: string) => `Replace icon component with literal: ${literal}`;

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
            if (initializer === undefined) {
                // no-op
            } else if (ts.isStringLiteral(initializer) && option === OPTION_COMPONENT) {
                // "tick" -> <TickIcon />
                const iconName = `<${pascalCase(initializer.text)}Icon />`;
                addFailure(ctx, node, Rule.componentMessage(iconName), `{${iconName}}`);
            } else if (ts.isJsxExpression(initializer) && option === OPTION_LITERAL) {
                // <TickIcon /> -> "tick"
                const match = /<(\w+)Icon /.exec(initializer.getText());
                if (match != null) {
                    const message = Rule.literalMessage(`"${dashCase(match[1])}"`);
                    addFailure(ctx, node, message, message);
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function addFailure(ctx: Lint.WalkContext<string>, node: ts.Declaration, message: string, replacement?: string) {
    const offsetLength = "icon=".length;
    const start = node.getStart(ctx.sourceFile) + offsetLength;
    const width = node.getWidth(ctx.sourceFile) - offsetLength;
    const fixer = replacement == null ? undefined : new Lint.Replacement(start, width, replacement);
    ctx.addFailureAt(start, width, message, fixer);
}

/** "MultiWordPhrase" => "multi-word-phrase" */
function dashCase(text: string) {
    return text.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`).replace(/^-+/, "");
}

/** "multi-word-phrase" => "MultiWordPhrase" */
function pascalCase(text: string) {
    return text
        .split("-")
        .map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
        .join("");
}
