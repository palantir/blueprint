/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "./utils/createRule";

const DEPRECATED_TO_NEW_MAPPING: { [deprecated: string]: string } = {
    AbstractComponent: "AbstractComponent2",
    AbstractPureComponent: "AbstractPureComponent2",
    CollapsibleList: "OverflowList",
    DateRangeInput: "DateRangeInput2",
    MultiSelect: "MultiSelect2",
    PanelStack: "PanelStack2",
    Popover: "Popover2",
    Select: "Select2",
    Suggest: "Suggest2",
    TimezonePicker: "TimezoneSelect",
    Tooltip: "Tooltip2",
};
const PACKAGES_WITH_DEPRECATED_IMPORTS = ["@blueprintjs/core", "@blueprintjs/select", "@blueprintjs/timezone"];

type MessageIds = "migration";

/**
 * This rule checks a hardcoded list of components that Blueprint is actively migrating to a newer version (e.g. v1 -> v2)
 * If deprecated versions (v1) are detected, it will recommend using the replacement component (e.g. the v2) instead.
 * Note that this does not rely on the @deprecated JSDoc annotation, and is thus distinct/very different from the
 * deprecated/deprecated ESLint rule
 */
// tslint:disable object-literal-sort-keys
export const noDeprecatedComponentsRule = createRule<unknown[], MessageIds>({
    name: "no-deprecated-components",
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Reports on usage of deprecated Blueprint components and recommends migrating to their corresponding newer non-deprecated API alternatives.",
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
                            deprecatedComponentName: node.name,
                            newComponentName: DEPRECATED_TO_NEW_MAPPING[node.name],
                        },
                        messageId: "migration",
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
                            deprecatedComponentName: node.property.name,
                            newComponentName: DEPRECATED_TO_NEW_MAPPING[node.property.name],
                        },
                        messageId: "migration",
                        node: node.property,
                    });
                }
            },
            "ClassDeclaration[superClass.type='Identifier']": (node: TSESTree.ClassDeclaration) => {
                const superClass = node.superClass as TSESTree.Identifier;
                if (isDeprecatedComponent(superClass.name)) {
                    context.report({
                        data: {
                            deprecatedComponentName: superClass.name,
                            newComponentName: DEPRECATED_TO_NEW_MAPPING[superClass.name],
                        },
                        messageId: "migration",
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
                            deprecatedComponentName: superClass.property.name,
                            newComponentName: DEPRECATED_TO_NEW_MAPPING[superClass.property.name],
                        },
                        messageId: "migration",
                        node: superClass.property,
                    });
                }
            },
        };
    },
});
