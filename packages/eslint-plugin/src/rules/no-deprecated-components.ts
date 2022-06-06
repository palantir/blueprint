/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "./utils/createRule";

const DEPRECATED_TO_NEW_MAPPING: { [deprecated: string]: string } = {
    AbstractComponent: "AbstractComponent2",
    AbstractPureComponent: "AbstractPureComponent2",
    CollapsibleList: "OverflowList",
    MultiSelect: "MultiSelect2",
    PanelStack: "PanelStack2",
    Popover: "Popover2",
    Select: "Select2",
    Suggest: "Suggest2",
    Tooltip: "Tooltip2",
};
const PACKAGES_WITH_DEPRECATED_IMPORTS = ["@blueprintjs/core", "@blueprintjs/select"];

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

        function isDeprecatedComponent(name: string) {
            if (deprecatedImports.length === 0) {
                return false;
            }

            return deprecatedImports.some(
                deprecatedImport =>
                    (deprecatedImport.type === "function" && deprecatedImport.localFunctionName === name) ||
                    DEPRECATED_TO_NEW_MAPPING[name] != null,
            );
        }

        function isDeprecatedNamespacedComponent(name: string, property: string) {
            return (
                deprecatedImports.some(
                    deprecatedImport => deprecatedImport.type === "namespace" && deprecatedImport.namespace === name,
                ) && DEPRECATED_TO_NEW_MAPPING[property] != null
            );
        }

        // Get the list of all deprecated imports from blueprint
        return {
            "Program > ImportDeclaration": (node: TSESTree.ImportDeclaration) => {
                if (!PACKAGES_WITH_DEPRECATED_IMPORTS.includes(node.source.value)) {
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
            // Tests that <DeprecatedComponent /> is flagged
            "JSXElement > JSXOpeningElement > JSXIdentifier": (node: TSESTree.JSXIdentifier) => {
                if (isDeprecatedComponent(node.name)) {
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
            // Tests that <Blueprint.DeprecatedComponent /> is flagged
            "JSXElement > JSXOpeningElement > JSXMemberExpression[property.type='JSXIdentifier']": (
                node: TSESTree.JSXMemberExpression,
            ) => {
                if (
                    node.object.type !== TSESTree.AST_NODE_TYPES.JSXIdentifier ||
                    node.property.type !== TSESTree.AST_NODE_TYPES.JSXIdentifier
                ) {
                    return;
                }

                const namespaceIdentifier = node.object;
                if (isDeprecatedNamespacedComponent(namespaceIdentifier.name, node.property.name)) {
                    // Uses a blueprint namespace and a deprecated property
                    context.report({
                        data: {
                            deprecated: node.property.name,
                            nonDeprecated: DEPRECATED_TO_NEW_MAPPING[node.property.name],
                        },
                        messageId: "nonDeprecated",
                        node: node.property,
                    });
                }
            },
            "ClassDeclaration[superClass.type='Identifier']": (node: TSESTree.ClassDeclaration) => {
                const superClass = node.superClass as TSESTree.Identifier;
                if (isDeprecatedComponent(superClass.name)) {
                    context.report({
                        data: {
                            deprecated: superClass.name,
                            nonDeprecated: DEPRECATED_TO_NEW_MAPPING[superClass.name],
                        },
                        messageId: "nonDeprecated",
                        node,
                    });
                }
            },
            "ClassDeclaration[superClass.type='MemberExpression']": (node: TSESTree.ClassDeclaration) => {
                const superClass = node.superClass as TSESTree.MemberExpression;
                if (
                    superClass.property.type !== TSESTree.AST_NODE_TYPES.Identifier ||
                    superClass.object.type !== TSESTree.AST_NODE_TYPES.Identifier
                ) {
                    return;
                }

                const namespaceIdentifier = superClass.object;
                if (isDeprecatedNamespacedComponent(namespaceIdentifier.name, superClass.property.name)) {
                    // Uses a blueprint namespace and a deprecated property
                    context.report({
                        data: {
                            deprecated: superClass.property.name,
                            nonDeprecated: DEPRECATED_TO_NEW_MAPPING[superClass.property.name],
                        },
                        messageId: "nonDeprecated",
                        node: superClass.property,
                    });
                }
            },
        };
    },
});
