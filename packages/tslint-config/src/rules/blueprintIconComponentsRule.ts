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
            if (ts.isStringLiteral(initializer) && option === OPTION_COMPONENT) {
                addFailure(ctx, node, Rule.COMPONENT_MESSAGE, `icon={<${pascalCase(initializer.text)}Icon />}`);
            } else if (ts.isJsxExpression(initializer) && option === OPTION_LITERAL) {
                const match = /<(\w+)Icon /.exec(initializer.getText());
                const literal = match == null ? undefined : `icon="${dashCase(match[1])}"`;
                addFailure(ctx, node, Rule.LITERAL_MESSAGE, literal);
            }
        }
        return ts.forEachChild(node, cb);
    });
}

function addFailure(ctx: Lint.WalkContext<string>, node: ts.Declaration, message: string, replacement?: string) {
    const start = node.getStart(ctx.sourceFile);
    const width = node.getWidth(ctx.sourceFile);
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
