/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable sort-keys */

import { type TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../utils/createRule";

type MessageIds =
    | "migration"
    | "migrationToNewPackage"
    | "migrationWithPropUsage"
    | "migrationWithPropUsageToNewPackage";

/**
 * Key is either:
 *  -   the name of a deprecated component, or
 *  -   a component name + prop identifier (e.g. "ComponentV1.propName") which indicates that usage of
 *      <ComponentV1 propName={...}> should be flagged.
 *
 * Value is either:
 *  -   the name of a corresponding non-deprecated component (if it exists in the same package), or
 *  -   a tuple containing:
 *          1. name of non-deprecated component
 *          2. the package where that component is found
 */
export type DeprecatedComponentsConfig = Record<string, string | [string, string]>;

/**
 * Higher-order function to create an ESLint rule which checks for usage of deprecated React components in JSX syntax.
 *
 * @param packagesToCheck Only components imported from these packages will be flagged.
 *
 * @param deprecatedComponentConfig Configuration of the deprecated components to lint for. Note that this configuration
 *  is not exposed to lint rule users, it just lives inside our rule implementations. Lint violations will include a
 *  recommendation to migrate to the newer, non-deprecated component specified in this mapping.
 */
export function createNoDeprecatedComponentsRule(
    ruleName: string,
    packagesToCheck: string[],
    deprecatedComponentConfig: DeprecatedComponentsConfig,
): TSESLint.RuleModule<MessageIds, unknown[]> {
    const descriptionFromClause = packagesToCheck.length === 1 ? ` from ${packagesToCheck[0]}` : "";

    return createRule<unknown[], MessageIds>({
        name: ruleName,
        meta: {
            type: "suggestion",
            docs: {
                description: `Reports on usage of deprecated Blueprint components${descriptionFromClause} and recommends migrating to their corresponding non-deprecated API alternatives.`,
                requiresTypeChecking: false,
                recommended: "recommended",
            },
            messages: {
                migration:
                    "Usage of {{ deprecatedComponentName }} is deprecated, migrate to {{ newComponentName }} instead",
                migrationToNewPackage:
                    "Usage of {{ deprecatedComponentName }} is deprecated, migrate to {{ newComponentName }} from '{{ newPackageName }}' instead",
                migrationWithPropUsage:
                    "Usage of {{ deprecatedComponentName }} with prop '{{ deprecatedPropName }}' is deprecated, migrate to {{ newComponentName }} instead",
                migrationWithPropUsageToNewPackage:
                    "Usage of {{ deprecatedComponentName }} with prop '{{ deprecatedPropName }}' is deprecated, migrate to {{ newComponentName }} from '{{ newPackageName }}' instead",
            },
            schema: [
                {
                    type: "string",
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
            const additionalDeprecatedComponents = Object.keys(deprecatedComponentConfig).reduce<string[]>(
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
                    deprecatedComponentConfig[name] != null &&
                    deprecatedImports.some(
                        deprecatedImport =>
                            deprecatedImport.type === "function" && deprecatedImport.localFunctionName === name,
                    )
                );
            }

            function isDeprecatedNamespacedComponent(name: string, property: string) {
                return (
                    deprecatedComponentConfig[property] != null &&
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
                        deprecatedComponentConfig[`${elementName}.${attribute.name.name}`] != null,
                );

                if (deprecatedProp === undefined) {
                    return;
                }

                const deprecatedPropName = ((deprecatedProp as TSESTree.JSXAttribute).name as TSESTree.JSXIdentifier)
                    .name;

                context.report(
                    getReportDescriptor(
                        jsxOpeningElementChildNode,
                        deprecatedComponentConfig,
                        elementName,
                        deprecatedPropName,
                    ),
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
                                if (
                                    deprecatedComponentConfig[importClause.imported.name] != null ||
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
                        context.report(getReportDescriptor(node, deprecatedComponentConfig, node.name));
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
                        context.report(
                            getReportDescriptor(node.property, deprecatedComponentConfig, node.property.name),
                        );
                    } else if (isOpeningElement(node.parent)) {
                        // check <Blueprint.DeprecatedComponent withDeprecatedProp={...}> syntax
                        checkDeprecatedComponentAndProp(node, node.property.name, node.parent);
                    }
                },

                // check `class Foo extends DeprecatedComponent` syntax
                "ClassDeclaration[superClass.type='Identifier']": (node: TSESTree.ClassDeclaration) => {
                    const superClass = node.superClass as TSESTree.Identifier;
                    if (isDeprecatedComponent(superClass.name)) {
                        context.report(getReportDescriptor(node, deprecatedComponentConfig, superClass.name));
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
                        context.report(
                            getReportDescriptor(
                                superClass.property,
                                deprecatedComponentConfig,
                                superClass.property.name,
                            ),
                        );
                    }
                },

                // check `MultiSelect.ofType<T>()` syntax
                "MemberExpression[object.type='Identifier']": (node: TSESTree.MemberExpression) => {
                    if (node.object.type !== TSESTree.AST_NODE_TYPES.Identifier) {
                        return;
                    }

                    if (isDeprecatedComponent(node.object.name)) {
                        context.report(getReportDescriptor(node.object, deprecatedComponentConfig, node.object.name));
                    }
                },
            };
        },
    });
}

function isOpeningElement(parent: TSESTree.Node | undefined): parent is TSESTree.JSXOpeningElement {
    return parent?.type === TSESTree.AST_NODE_TYPES.JSXOpeningElement;
}

/**
 * Returns a lint report descriptor for a particular kind of deprecated component usage.
 * Parses the config to determine the appropriate message ID and data to include in the report.
 */
function getReportDescriptor(
    node: TSESTree.Node,
    config: DeprecatedComponentsConfig,
    deprecatedComponentName: string,
    deprecatedPropName?: string,
): TSESLint.ReportDescriptor<MessageIds> {
    const configKey =
        deprecatedPropName === undefined ? deprecatedComponentName : `${deprecatedComponentName}.${deprecatedPropName}`;
    const configValue = config[configKey];
    const [newComponentName, newPackageName] = Array.isArray(configValue) ? configValue : [configValue, undefined];

    const messageId =
        deprecatedPropName === undefined
            ? newPackageName === undefined
                ? "migration"
                : "migrationToNewPackage"
            : newPackageName === undefined
              ? "migrationWithPropUsage"
              : "migrationWithPropUsageToNewPackage";

    return {
        data: {
            deprecatedComponentName,
            deprecatedPropName,
            newComponentName,
            newPackageName,
        },
        messageId,
        node,
    };
}
