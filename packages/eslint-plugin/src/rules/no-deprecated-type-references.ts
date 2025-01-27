/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable sort-keys */

import { type TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "./utils/createRule";
import { FixList } from "./utils/fixList";
import { getAllIdentifiersInFile } from "./utils/getAllIdentifiersInFile";
import { getProgram } from "./utils/getProgram";
import { replaceImportInFile } from "./utils/replaceImportInFile";

type MessageIds = "migration";

/**
 * A list of deprecated types in the public API, grouped by the package they are exported in.
 *
 * If a type name is listed here as a string literal, it is assumed that the new non-deprecated type
 * has the same name without the "I" prefix.
 *
 * If a type is listed here as a tuple, that tuple is interpreted as [deprecatedTypeName, newTypeName].
 */
const DEPRECATED_TYPE_REFERENCES_BY_PACKAGE = {
    "@blueprintjs/core": [
        "IProps",
        "IIntentProps",
        "IActionProps",
        "ILinkProps",
        ["IControlledProps", "ControlledProps2"],
        "IControlledProps2",
        "IOptionProps",
        "IKeyAllowlist",
        "IKeyDenylist",
        "IAlertProps",
        "IBreadcrumbProps",
        "IBreadcrumbsProps",
        "IButtonProps",
        "IAnchorButtonProps",
        "IButtonGroupProps",
        "ICalloutProps",
        "ICardProps",
        "ICollapseProps",
        "IDialogProps",
        "IDialogStepProps",
        "IMultistepDialogProps",
        "IDrawerProps",
        "IEditableTextProps",
        "IControlGroupProps",
        "IControlProps",
        "ISwitchProps",
        "IRadioProps",
        "ICheckboxProps",
        "IFileInputProps",
        "IFormGroupProps",
        ["IInputGroupProps", "InputGroupProps2"],
        "IInputGroupProps2",
        "INumericInputProps",
        "IRadioGroupProps",
        "ITextAreaProps",
        "IKeyComboProps",
        "IHTMLSelectProps",
        "IHTMLTableProps",
        "IIconProps",
        "IMenuProps",
        "IMenuDividerProps",
        "IMenuItemProps",
        "INavbarProps",
        "INavbarGroupProps",
        "INavbarHeadingProps",
        "INonIdealStateProps",
        "IOverflowListProps",
        "IOverlayableProps",
        "IOverlayProps",
        // N.B. Panel corresponds to PanelStack2, so it is not a direct replacement for IPanel
        // "IPanel",
        // "IPanelProps",
        "IPortalProps",
        "IProgressBarProps",
        "IResizeSensorProps",
        "IHandleProps",
        "IMultiSliderProps",
        "IRangeSliderProps",
        "ISliderBaseProps",
        "ISliderProps",
        "ITabProps",
        "ITabsProps",
        "ITabTitleProps",
        "ITagProps",
        "ITagInputProps",
        "ITextProps",
        "IToastProps",
        "ITreeProps",
        ["IPortalContext", "PortalLegacyContext"],
        ["IToaster", "ToasterInstance"],
        ["IToasterProps", "OverlayToasterProps"],
        "IToastOptions",
        ["ITreeNode", "TreeNodeInfo"],
    ],

    "@blueprintjs/datetime": [
        "IDateFormatProps",
        "IDateInputProps",
        "IDatePickerProps",
        "IDatePickerModifiers",
        "IDatePickerShortcut",
        "IDateRangeInputProps",
        "IDateRangeShortcut",
        "ITimePickerProps",
    ],

    "@blueprintjs/docs-theme": ["IDocsExampleProps", "IExampleProps", "INavMenuItemProps", "ITagRendererMap"],

    "@blueprintjs/popover2": [
        "IPopover2Props",
        "IPopover2TargetProps",
        "IPopover2SharedProps",
        "ITooltip2Props",
        ["ContextMenu2RenderProps", "ContextMenu2TargetProps"],
    ],

    "@blueprintjs/select": [
        "IItemListRendererProps",
        "IItemModifiers",
        "IItemRendererProps",
        "IListItemsProps",
        "ICreateNewItem",
        "IMultiSelectProps",
        "IOmnibarProps",
        "IQueryListProps",
        "IQueryListRendererProps",
        "ISelectProps",
        "ISuggestProps",
    ],

    "@blueprintjs/table": [
        "ICellCoordinate",
        "ICellInterval",
        "ICellProps",
        "ICellRenderer",
        "IColumnHeaderCellProps",
        "IColumnHeaderCellRenderer",
        "IColumnHeaderRenderer",
        "IColumnProps",
        "IContextMenuRenderer",
        "ICoordinateData",
        "IFocusedCellCoordinates",
        "IJSONFormatProps",
        "IMenuContext",
        "IRegion",
        "IRowHeaderCellProps",
        "IRowHeaderRenderer",
        "IStyledRegionGroup",
        "ITableBodyProps",
        "ITableProps",
        "ITruncatedFormatProps",
    ],
};

/**
 * Returns two records which can be used to look up the replacement type for a given deprecated type name
 * and the package from which it is exported.
 */
function getTypeMappings() {
    const deprecatedToNewTypeMapping: Record<string, string> = {};
    const newTypeToPackageNameMapping: Record<string, string> = {};

    for (const [packageName, deprecatedTypeNames] of Object.entries(DEPRECATED_TYPE_REFERENCES_BY_PACKAGE)) {
        for (const typeName of deprecatedTypeNames) {
            if (Array.isArray(typeName)) {
                const [deprecatedTypeName, newTypeName] = typeName;
                deprecatedToNewTypeMapping[deprecatedTypeName] = newTypeName;
                newTypeToPackageNameMapping[newTypeName] = packageName;
            } else {
                const newTypeName = typeName.slice(1);
                // "IProps": "Props"
                deprecatedToNewTypeMapping[typeName] = newTypeName;
                // "Props": "@blueprintjs/core"
                newTypeToPackageNameMapping[newTypeName] = packageName;
            }
        }
    }

    return [deprecatedToNewTypeMapping, newTypeToPackageNameMapping];
}

export const noDeprecatedTypeReferencesRule = createRule<[], MessageIds>({
    name: "no-deprecated-type-references",
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Reports on usage of deprecated Blueprint types and recommends migrating to their corresponding replacements.",
            requiresTypeChecking: false,
            recommended: "recommended",
        },
        fixable: "code",
        messages: {
            migration: "Usage of {{ deprecatedTypeName }} is deprecated, migrate to {{ newTypeName }} instead",
        },
        schema: [
            {
                type: "string",
                enum: ["migration"],
            },
        ],
    },
    defaultOptions: [],
    create: (context: TSESLint.RuleContext<MessageIds, []>) => {
        const [deprecatedToNewType, newTypeToPackageName] = getTypeMappings();
        const deprecatedImports: Array<
            { namespace: string; type: "namespace" } | { type: "symbol"; symbolName: string; localSymbolName: string }
        > = [];
        // keep a list of already fixed imports in the file so that we do not report overlapping fixes
        const fixedImportNames: string[] = [];
        const identifiersInFile = getAllIdentifiersInFile(context.sourceCode);

        function isDeprecatedTypeReference(name: string) {
            return (
                deprecatedToNewType.hasOwnProperty(name) &&
                deprecatedImports.some(
                    deprecatedImport => deprecatedImport.type === "symbol" && deprecatedImport.localSymbolName === name,
                )
            );
        }

        function isDeprecatedNamespacedTypeReference(name: string, property: string) {
            return (
                deprecatedToNewType.hasOwnProperty(property) &&
                deprecatedImports.some(
                    deprecatedImport => deprecatedImport.type === "namespace" && deprecatedImport.namespace === name,
                )
            );
        }

        return {
            // get the list of all deprecated imports from packages included in the provided list
            "Program > ImportDeclaration": (node: TSESTree.ImportDeclaration) => {
                if (!Object.keys(DEPRECATED_TYPE_REFERENCES_BY_PACKAGE).includes(node.source.value)) {
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
                            if (deprecatedToNewType.hasOwnProperty(importClause.imported.name)) {
                                deprecatedImports.push({
                                    symbolName: importClause.imported.name,
                                    localSymbolName: importClause.local.name,
                                    type: "symbol",
                                });
                            }
                            break;
                    }
                }
            },

            TSTypeReference: (node: TSESTree.TSTypeReference) => {
                switch (node.typeName.type) {
                    case TSESTree.AST_NODE_TYPES.Identifier:
                        if (isDeprecatedTypeReference(node.typeName.name)) {
                            const deprecatedTypeName = node.typeName.name;
                            const newTypeName = deprecatedToNewType[deprecatedTypeName];
                            const doesNewTypeRequireAlias = identifiersInFile.includes(newTypeName);
                            const newTypeAlias = doesNewTypeRequireAlias ? `Blueprint${newTypeName}` : undefined;
                            context.report({
                                data: { deprecatedTypeName, newTypeName },
                                messageId: "migration",
                                node,
                                fix: fixer => {
                                    const fixes = new FixList();
                                    fixes.addFixes(fixer.replaceText(node.typeName, newTypeAlias ?? newTypeName));
                                    const program = getProgram(node);
                                    if (program !== undefined && !fixedImportNames.includes(deprecatedTypeName)) {
                                        fixes.addFixes(
                                            replaceImportInFile(program, {
                                                fromName: deprecatedTypeName,
                                                toName: newTypeName,
                                                alias: newTypeAlias,
                                                moduleSpecifier: newTypeToPackageName[newTypeName],
                                            })(fixer),
                                        );
                                        fixedImportNames.push(deprecatedTypeName);
                                    }
                                    return fixes.getFixes();
                                },
                            });
                        }
                        return;
                    case TSESTree.AST_NODE_TYPES.TSQualifiedName:
                        // only deal with one level of chaining in a qualified name, like "BP.DeprecatedInterface"
                        if (
                            node.typeName.left.type === TSESTree.AST_NODE_TYPES.Identifier &&
                            isDeprecatedNamespacedTypeReference(node.typeName.left.name, node.typeName.right.name)
                        ) {
                            const deprecatedTypeName = node.typeName.right.name;
                            const newTypeName = deprecatedToNewType[deprecatedTypeName];
                            context.report({
                                data: { deprecatedTypeName, newTypeName },
                                messageId: "migration",
                                node,
                                fix: fixer =>
                                    fixer.replaceText((node.typeName as TSESTree.TSQualifiedName).right, newTypeName),
                            });
                        }
                        return;
                }
            },

            // lint syntax like `interface MyInterface extends DeprecatedInterface {...}`
            TSInterfaceHeritage: (node: TSESTree.TSInterfaceHeritage) => {
                if (node.expression.type === TSESTree.AST_NODE_TYPES.Identifier) {
                    if (isDeprecatedTypeReference(node.expression.name)) {
                        const deprecatedTypeName = node.expression.name;
                        const newTypeName = deprecatedToNewType[deprecatedTypeName];
                        const doesNewTypeRequireAlias = identifiersInFile.includes(newTypeName);
                        const newTypeAlias = doesNewTypeRequireAlias ? `Blueprint${newTypeName}` : undefined;
                        context.report({
                            data: { deprecatedTypeName, newTypeName },
                            messageId: "migration",
                            node,
                            fix: fixer => {
                                const fixes = new FixList();
                                fixes.addFixes(fixer.replaceText(node.expression, newTypeAlias ?? newTypeName));
                                const program = getProgram(node);
                                if (program !== undefined && !fixedImportNames.includes(deprecatedTypeName)) {
                                    fixes.addFixes(
                                        replaceImportInFile(program, {
                                            fromName: deprecatedTypeName,
                                            toName: newTypeName,
                                            alias: newTypeAlias,
                                            moduleSpecifier: newTypeToPackageName[newTypeName],
                                        })(fixer),
                                    );
                                    fixedImportNames.push(deprecatedTypeName);
                                }
                                return fixes.getFixes();
                            },
                        });
                    }
                }
            },

            // lint syntax like `interface MyInterface extends Blueprint.DeprecatedInterface {...}`
            "TSInterfaceHeritage MemberExpression": (node: TSESTree.MemberExpression) => {
                if (
                    node.property.type !== TSESTree.AST_NODE_TYPES.Identifier ||
                    node.object.type !== TSESTree.AST_NODE_TYPES.Identifier
                ) {
                    return;
                }

                if (isDeprecatedNamespacedTypeReference(node.object.name, node.property.name)) {
                    const deprecatedTypeName = node.property.name;
                    const newTypeName = deprecatedToNewType[deprecatedTypeName];
                    context.report({
                        data: { deprecatedTypeName, newTypeName },
                        messageId: "migration",
                        node,
                        fix: fixer => fixer.replaceText(node.property, newTypeName),
                    });
                }
            },
        };
    },
});
