/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

// tslint:disable object-literal-sort-keys

import { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../utils/createRule";

type MessageIds = "migration";

/**
 * Higher-order function to create an ESLint rule which checks for usage of deprecated React components
 * in JSX syntax.
 *
 * Only components imported from `packagesToCheck` will be flagged. The lint violation will include
 * a recommendation to migrate to the newer, non-deprecated component (this must be specified for each
 * component via the second argument `deprecatedToNewComponentMapping`).
 */
export function createNoDeprecatedComponentsRule(
    ruleName: string,
    packagesToCheck: string[],
    deprecatedToNewComponentMapping: {
        [deprecated: string]: string;
    },
): TSESLint.RuleModule<MessageIds, unknown[]> {
    const descriptionFromClause = packagesToCheck.length === 1 ? ` from ${packagesToCheck[0]}` : "";

    return createRule<unknown[], MessageIds>({
        name: ruleName,
        meta: {
            type: "suggestion",
            docs: {
                description: `Reports on usage of deprecated Blueprint components${descriptionFromClause} and recommends migrating to their corresponding non-deprecated API alternatives.`,
                requiresTypeChecking: false,
                recommended: "error",
            },
            messages: {
                migration: "{{ deprecatedComponentName }} is deprecated, migrate to {{ newComponentName }} instead",
            },
            schema: [
                {
                    enum: ["migration"],
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
                        deprecatedToNewComponentMapping[name] != null,
                );
            }

            function isDeprecatedNamespacedComponent(name: string, property: string) {
                return (
                    deprecatedImports.some(
                        deprecatedImport =>
                            deprecatedImport.type === "namespace" && deprecatedImport.namespace === name,
                    ) && deprecatedToNewComponentMapping[property] != null
                );
            }

            // Get the list of all deprecated imports from packages included in the provided list
            return {
                "Program > ImportDeclaration": (node: TSESTree.ImportDeclaration) => {
                    if (!packagesToCheck.includes(node.source.value)) {
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
                                if (deprecatedToNewComponentMapping[importClause.imported.name] != null) {
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

                // check <DeprecatedComponent /> syntax
                "JSXElement > JSXOpeningElement > JSXIdentifier": (node: TSESTree.JSXIdentifier) => {
                    if (isDeprecatedComponent(node.name)) {
                        context.report({
                            data: {
                                deprecatedComponentName: node.name,
                                newComponentName: deprecatedToNewComponentMapping[node.name],
                            },
                            messageId: "migration",
                            node,
                        });
                    }
                },

                // check <Blueprint.DeprecatedComponent /> syntax
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
                                deprecatedComponentName: node.property.name,
                                newComponentName: deprecatedToNewComponentMapping[node.property.name],
                            },
                            messageId: "migration",
                            node: node.property,
                        });
                    }
                },

                // check `class Foo extends DeprecatedComponent` syntax
                "ClassDeclaration[superClass.type='Identifier']": (node: TSESTree.ClassDeclaration) => {
                    const superClass = node.superClass as TSESTree.Identifier;
                    if (isDeprecatedComponent(superClass.name)) {
                        context.report({
                            data: {
                                deprecatedComponentName: superClass.name,
                                newComponentName: deprecatedToNewComponentMapping[superClass.name],
                            },
                            messageId: "migration",
                            node,
                        });
                    }
                },

                // check `class Foo extends Blueprint.DeprecatedComponent` syntax
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
                                deprecatedComponentName: superClass.property.name,
                                newComponentName: deprecatedToNewComponentMapping[superClass.property.name],
                            },
                            messageId: "migration",
                            node: superClass.property,
                        });
                    }
                },
            };
        },
    });
}
