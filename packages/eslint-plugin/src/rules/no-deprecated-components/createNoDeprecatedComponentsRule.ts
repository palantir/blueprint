/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

// tslint:disable object-literal-sort-keys

import { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../utils/createRule";

type MessageIds = "migration" | "migrationWithPropUsage";

/**
 * Higher-order function to create an ESLint rule which checks for usage of deprecated React components
 * in JSX syntax.
 *
 * @param packagesToCheck Only components imported from these packages will be flagged.
 * @param deprecatedToNewComponentMapping Lint violations will include a recommendation to migrate to the newer,
 *  non-deprecated component specified in this mapping. Keys in this object may use
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
                migration:
                    "Usage of {{ deprecatedComponentName }} is deprecated, migrate to {{ newComponentName }} instead",
                migrationWithPropUsage:
                    "Usage of {{ deprecatedComponentName }} with prop '{{ deprecatedPropName }}' is deprecated, migrate to {{ newComponentName }} instead",
            },
            schema: [
                {
                    enum: ["migration", "migrationWithPropUsage"],
                },
            ],
        },
        defaultOptions: [],
        create: context => {
            const deprecatedImports: Array<
                | { namespace: string; type: "namespace" }
                | { type: "function"; functionName: string; localFunctionName: string }
            > = [];

            // parses out additional deprecated components from entries like { "MenuItem.popoverProps": "MenuItem2" }
            const additionalDeprecatedComponents = Object.keys(deprecatedToNewComponentMapping).reduce<string[]>(
                (components, key) => {
                    const [componentName, propName] = key.split(".");
                    if (propName !== undefined) {
                        components.push(componentName);
                    }
                    return components;
                },
                [],
            );

            function isDeprecatedComponent(name: string) {
                return (
                    deprecatedToNewComponentMapping[name] != null &&
                    deprecatedImports.some(
                        deprecatedImport =>
                            deprecatedImport.type === "function" && deprecatedImport.localFunctionName === name,
                    )
                );
            }

            function isDeprecatedNamespacedComponent(name: string, property: string) {
                return (
                    deprecatedToNewComponentMapping[property] != null &&
                    deprecatedImports.some(
                        deprecatedImport =>
                            deprecatedImport.type === "namespace" && deprecatedImport.namespace === name,
                    )
                );
            }

            function checkDeprecatedComponentAndProp(
                jsxOpeningElementChildNode: TSESTree.Node,
                elementName: string,
                openingElementNode: TSESTree.JSXOpeningElement,
            ) {
                const deprecatedProp = openingElementNode.attributes.find(
                    attribute =>
                        attribute.type === TSESTree.AST_NODE_TYPES.JSXAttribute &&
                        attribute.name.type === TSESTree.AST_NODE_TYPES.JSXIdentifier &&
                        deprecatedToNewComponentMapping[`${elementName}.${attribute.name.name}`] != null,
                );

                if (deprecatedProp === undefined) {
                    return;
                }

                const deprecatedComponentKey = Object.keys(deprecatedToNewComponentMapping).find(
                    key => key.includes(".") && key.split(".")[0] === elementName,
                );
                const deprecatedPropName = ((deprecatedProp as TSESTree.JSXAttribute).name as TSESTree.JSXIdentifier)
                    .name;
                context.report({
                    data: {
                        deprecatedComponentName: elementName,
                        deprecatedPropName,
                        newComponentName: deprecatedToNewComponentMapping[deprecatedComponentKey!],
                    },
                    messageId: "migrationWithPropUsage",
                    node: jsxOpeningElementChildNode,
                });
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
                                if (
                                    deprecatedToNewComponentMapping[importClause.imported.name] != null ||
                                    additionalDeprecatedComponents.includes(importClause.imported.name)
                                ) {
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

                // check <DeprecatedComponent> syntax (includes self-closing tags)
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
                    } else if (isOpeningElement(node.parent)) {
                        // check <DeprecatedComponent withDeprecatedProp={...}> syntax
                        checkDeprecatedComponentAndProp(node, node.name, node.parent);
                    }
                },

                // check <Blueprint.DeprecatedComponent> syntax (includes self-closing tags)
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
                    } else if (isOpeningElement(node.parent)) {
                        // check <Blueprint.DeprecatedComponent withDeprecatedProp={...}> syntax
                        checkDeprecatedComponentAndProp(node, node.property.name, node.parent);
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

function isOpeningElement(parent: TSESTree.Node | undefined): parent is TSESTree.JSXOpeningElement {
    return parent?.type === TSESTree.AST_NODE_TYPES.JSXOpeningElement;
}
