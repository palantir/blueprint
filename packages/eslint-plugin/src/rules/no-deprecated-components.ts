/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "./utils/createRule";

const DEPRECATED_TO_NEW_MAPPING: { [deprecated: string]: string } = {
    AbstractComponent: "AbstractComponentV2",
    AbstractPureComponent: "AbstractPureComponentV2",
    CollapsibleList: "OverflowList",
};

type MessageIds = "nonDeprecated" | "deprecated";

// tslint:disable object-literal-sort-keys
export const noDeprecatedComponentsRule = createRule<unknown[], MessageIds>({
    name: "no-deprecated-components",
    meta: {
        type: "suggestion",
        docs: {
            description: "Recommends using non-deprecated versions of the component or constant instead",
            requiresTypeChecking: false,
            recommended: "error",
        },
        messages: {
            nonDeprecated: "Replace deprecated component {{ deprecated }} with {{ nonDeprecated }}",
            deprecated: "This component or constant is deprecated with no replacement.",
        },
        schema: [
            {
                enum: ["nonDeprecated", "deprecated"],
            },
        ],
    },
    defaultOptions: [],
    create: context => {
        const deprecatedImports: Array<
            | { namespace: string; type: "namespace" }
            | { type: "function"; functionName: string; localFunctionName: string }
        > = [];

        function isDeprecated(name: string) {
            if (deprecatedImports.length === 0) {
                return false;
            }

            return deprecatedImports.some(
                deprecatedImport =>
                    (deprecatedImport.type === "function" && deprecatedImport.localFunctionName === name) ||
                    DEPRECATED_TO_NEW_MAPPING[name] != null,
            );
        }

        // Get the list of all deprecated imports from blueprint
        return {
            "Program > ImportDeclaration": (node: TSESTree.ImportDeclaration) => {
                if (node.source.value !== "@blueprintjs/core") {
                    return;
                }
                for (const importClause of node.specifiers) {
                    switch (importClause.type) {
                        case TSESTree.AST_NODE_TYPES.ImportDefaultSpecifier:
                        case TSESTree.AST_NODE_TYPES.ImportNamespaceSpecifier:
                            deprecatedImports.push({
                                namespace: importClause.local.name,
                                type: "namespace",
                            });
                            break;
                        case TSESTree.AST_NODE_TYPES.ImportSpecifier:
                            if (DEPRECATED_TO_NEW_MAPPING[importClause.imported.name] != null) {
                                deprecatedImports.push({
                                    functionName: importClause.imported.name,
                                    localFunctionName: importClause.local.name,
                                    type: "function",
                                });
                            }
                            break;
                    }
                }
            },
            "JSXElement > JSXOpeningElement > JSXIdentifier": (node: TSESTree.JSXIdentifier) => {
                if (isDeprecated(node.name)) {
                    context.report({
                        data: {
                            deprecated: node.name,
                            nonDeprecated: DEPRECATED_TO_NEW_MAPPING[node.name],
                        },
                        messageId: "nonDeprecated",
                        node,
                    });
                }
            },
        };
    },
});
