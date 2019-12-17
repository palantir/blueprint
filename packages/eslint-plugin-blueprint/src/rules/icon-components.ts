/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

// tslint:disable: object-literal-sort-keys
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/experimental-utils";
import { RuleContext } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { createRule } from "./utils/createRule";

export const OPTION_COMPONENT = "component";
export const OPTION_LITERAL = "literal";

type Options = ["component" | "literal"];

type MessageIds = "component" | "literal";

export const iconComponentsRule = createRule<Options, MessageIds>({
    name: "icon-components",
    meta: {
        docs: {
            description: "Enforce usage of JSX Icon components over IconName string literals (or vice-versa)",
            category: "Stylistic Issues",
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

function create(context: RuleContext<MessageIds, Options>, node: TSESTree.JSXAttribute): void {
    const option = context.options[0];

    if (node.name.name !== "icon") {
        return;
    }

    const valueNode = node.value;
    if (valueNode == null) {
        // no-op
    } else if (valueNode.type === AST_NODE_TYPES.Literal && valueNode.value != null && option === OPTION_COMPONENT) {
        // "tick" -> <TickIcon />
        const iconName = `<${pascalCase(valueNode.value.toString())}Icon />`;

        context.report({
            messageId: OPTION_COMPONENT,
            node,
            data: {
                component: iconName,
            },
            fix: fixer => fixer.replaceText(valueNode, `{${iconName}}`),
        });
    } else if (valueNode.type === AST_NODE_TYPES.JSXExpressionContainer && option === OPTION_LITERAL) {
        // <TickIcon /> -> "tick"
        const identifierNode =
            valueNode.expression.type === AST_NODE_TYPES.JSXElement
                ? valueNode.expression.openingElement.name
                : undefined;
        if (identifierNode !== undefined && identifierNode.type === AST_NODE_TYPES.JSXIdentifier) {
            const match = /(\w+)Icon/.exec(identifierNode.name);
            if (match != null) {
                const iconName = `"${dashCase(match[1])}"`;

                context.report({
                    messageId: OPTION_LITERAL,
                    node,
                    data: {
                        literal: iconName,
                    },
                    fix: fixer => fixer.replaceText(valueNode, iconName),
                });
            }
        }
    }
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
