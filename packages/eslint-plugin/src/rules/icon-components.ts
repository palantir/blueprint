/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "./utils/createRule";

export const OPTION_COMPONENT = "component";
export const OPTION_LITERAL = "literal";

type Options = ["component" | "literal"];
type MessageIds = "component" | "literal";

// tslint:disable object-literal-sort-keys
export const iconComponentsRule = createRule<Options, MessageIds>({
    name: "icon-components",
    meta: {
        docs: {
            description: "Enforce usage of JSX Icon components over IconName string literals (or vice-versa)",
            recommended: "error",
            requiresTypeChecking: false,
        },
        fixable: "code",
        messages: {
            [OPTION_COMPONENT]: "Replace icon literal with component: {{ component }}",
            [OPTION_LITERAL]: "Replace icon component with literal: {{ literal }}",
        },
        schema: [
            {
                enum: [OPTION_COMPONENT, OPTION_LITERAL],
            },
        ],
        type: "suggestion",
    },
    defaultOptions: [OPTION_COMPONENT],
    create: context => ({
        JSXAttribute: node => create(context, node),
    }),
});
// tslint:enable object-literal-sort-keys

function create(context: TSESLint.RuleContext<MessageIds, Options>, node: TSESTree.JSXAttribute): void {
    const option = context.options[0] || OPTION_COMPONENT;
    const sourceCode = context.getSourceCode();

    if (node.name.name !== "icon") {
        return;
    }

    const valueNode = node.value;
    if (valueNode == null) {
        // no-op
    } else if (valueNode.type === AST_NODE_TYPES.Literal && valueNode.value != null && option === OPTION_COMPONENT) {
        // "tick" -> <TickIcon />
        const quotedIconName = sourceCode.getText(valueNode);
        const iconTag = `<${pascalCase(quotedIconName.slice(1, quotedIconName.length - 1))}Icon />`;

        context.report({
            data: {
                component: iconTag,
            },
            fix: fixer => fixer.replaceText(valueNode, `{${iconTag}}`),
            messageId: OPTION_COMPONENT,
            node,
        });
    } else if (valueNode.type === AST_NODE_TYPES.JSXExpressionContainer && option === OPTION_LITERAL) {
        // <TickIcon /> -> "tick"
        const componentText = sourceCode.getText(valueNode.expression);
        const match = /<(\w+)Icon /.exec(componentText);
        if (match != null) {
            const iconName = `"${kebabCase(match[1])}"`;

            context.report({
                data: {
                    literal: iconName,
                },
                fix: fixer => fixer.replaceText(valueNode, iconName),
                messageId: OPTION_LITERAL,
                node,
            });
        }
    }
}

/** "MultiWordPhrase" => "multi-word-phrase" */
function kebabCase(text: string) {
    return text.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`).replace(/^-+/, "");
}

/** "multi-word-phrase" => "MultiWordPhrase" */
function pascalCase(text: string) {
    return text
        .split("-")
        .map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
        .join("");
}
