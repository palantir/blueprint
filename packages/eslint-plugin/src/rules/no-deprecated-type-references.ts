/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

// tslint:disable object-literal-sort-keys

import { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "./utils/createRule";
import { FixList } from "./utils/fixList";
import { getProgram } from "./utils/getProgram";
import { replaceImportInFile } from "./utils/replaceImportInFile";

type MessageIds = "migration";

const PACKAGES_TO_CHECK = [
    "@blueprintjs/core",
    "@blueprintjs/datetime",
    "@blueprintjs/docs-theme",
    "@blueprintjs/popover2",
    "@blueprintjs/select",
    "@blueprintjs/table",
    "@blueprintjs/timezone",
];

const DEPRECATED_TYPE_REFERENCES_BY_PACKAGE = {
    "@blueprintjs/core": [
        "IProps",
        "IIntentProps",
        "IActionProps",
        "ILinkProps",
        "IControlledProps",
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
        "IInputGroupProps",
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
        "IPanel",
        "IPanelActions",
        "IPortalProps",
        "IProgressBarProps",
        "IResizeSensorProps",
        "IHandleProps",
        "IMultiSliderProps",
        "IRangeSliderProps",
        "ISliderProps",
        "ITabProps",
        "ITabsProps",
        "ITabTitleProps",
        "ITagProps",
        "ITagInputProps",
        "ITextProps",
        "IToastProps",
        "ITreeProps",
    ],

    "@blueprintjs/datetime": [
        "IDateFormatProps",
        "IDateInputProps",
        "IDatePickerProps",
        "IDatePickerModifiers",
        "IDateRangeInputProps",
        "IDateRangeShortcut",
        "ITimePickerProps",
    ],

    "@blueprintjs/docs-theme": ["IExampleProps", "INavMenuItemProps", "ITagRendererMap"],

    "@blueprintjs/popover2": ["IPopover2Props", "IPopover2TargetProps", "IPopover2SharedProps", "ITooltip2Props"],

    "@blueprintjs/select": [
        "IItemListRendererProps",
        "IItemModifiers",
        "IItemRendererProps",
        "IListItemsProps",
        "ICreateNewItem",
        "IMultiSelectProps",
        "IOmnibarProps",
        "IQueryListProps",
        "ISelectProps",
        "ISuggestProps",
    ],

    "@blueprintjs/table": [
        "IStyledRegionGroup",
        "ICellInterval",
        "ICellCoordinate",
        "IRegion",
        "ITableBodyProps",
        "ITableProps",
        "ICellRenderer",
        "IJSONFormatProps",
        "ITruncatedFormatProps",
        "IColumnHeaderCellRenderer",
        "IColumnHeaderCellProps",
        "IRowHeaderRenderer",
        "IRowHeaderCellProps",
    ],

    "@blueprintjs/timezone": ["ITimezoneItem", "ITimezonePickerProps"],
};

// some extra type mappings which do not fit the simple pattern of dropping the "I" prefix,
// these will be augmented to create the full list in the for-loop below
const DEPRECATED_TYPES_MAPPING: Record<string, string> = {
    IPortalContext: "PortalLegacyContext",
    IToaster: "ToasterInstance",
    ITreeNode: "TreeNodeInfo",
    ContextMenu2RenderProps: "ContextMenu2ContentProps",
};

// which packages to find the new types in
const NEW_TYPE_PACKAGE_MAPPING: Record<string, string> = {
    PortalLegacyContext: "@blueprintjs/core",
    ToasterInstance: "@blueprintjs/core",
    TreeNodeInfo: "@blueprintjs/core",
    ContextMenu2ContentProps: "@blueprintjs/popover2",
};

for (const [packageName, deprecatedTypeNames] of Object.entries(DEPRECATED_TYPE_REFERENCES_BY_PACKAGE)) {
    for (const typeName of deprecatedTypeNames) {
        const newTypeName = typeName.slice(1);
        // "IProps": "Props"
        DEPRECATED_TYPES_MAPPING[typeName] = newTypeName;
        // "Props": "@blueprintjs/core"
        NEW_TYPE_PACKAGE_MAPPING[newTypeName] = packageName;
    }
}

export const noDeprecatedTypeReferencesRule = createRule<[], MessageIds>({
    name: "no-deprecated-type-references",
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Reports on usage of deprecated Blueprint types and recommends migrating to their corresponding replacements.",
            requiresTypeChecking: false,
            recommended: "error",
        },
        fixable: "code",
        messages: {
            migration: "Usage of {{ deprecatedTypeName }} is deprecated, migrate to {{ newTypeName }} instead",
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
            { namespace: string; type: "namespace" } | { type: "symbol"; symbolName: string; localSymbolName: string }
        > = [];

        function isDeprecatedTypeReference(name: string) {
            return (
                DEPRECATED_TYPES_MAPPING.hasOwnProperty(name) &&
                deprecatedImports.some(
                    deprecatedImport => deprecatedImport.type === "symbol" && deprecatedImport.localSymbolName === name,
                )
            );
        }

        function isDeprecatedNamespacedTypeReference(name: string, property: string) {
            return (
                DEPRECATED_TYPES_MAPPING.hasOwnProperty(property) &&
                deprecatedImports.some(
                    deprecatedImport => deprecatedImport.type === "namespace" && deprecatedImport.namespace === name,
                )
            );
        }

        return {
            // get the list of all deprecated imports from packages included in the provided list
            "Program > ImportDeclaration": (node: TSESTree.ImportDeclaration) => {
                if (!PACKAGES_TO_CHECK.includes(node.source.value)) {
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
                            if (DEPRECATED_TYPES_MAPPING.hasOwnProperty(importClause.imported.name)) {
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
                            const newTypeName = DEPRECATED_TYPES_MAPPING[deprecatedTypeName];
                            context.report({
                                data: { deprecatedTypeName, newTypeName },
                                messageId: "migration",
                                node,
                                fix: fixer => {
                                    const fixes = new FixList();
                                    fixes.addFixes(fixer.replaceText(node.typeName, newTypeName));
                                    const program = getProgram(node);
                                    if (program !== undefined) {
                                        fixes.addFixes(
                                            replaceImportInFile(
                                                program,
                                                deprecatedTypeName,
                                                newTypeName,
                                                NEW_TYPE_PACKAGE_MAPPING[newTypeName],
                                            )(fixer),
                                        );
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
                            const newTypeName = DEPRECATED_TYPES_MAPPING[deprecatedTypeName];
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

            TSInterfaceHeritage: (node: TSESTree.TSInterfaceHeritage) => {
                if (node.expression.type === TSESTree.AST_NODE_TYPES.Identifier) {
                    if (isDeprecatedTypeReference(node.expression.name)) {
                        const deprecatedTypeName = node.expression.name;
                        const newTypeName = DEPRECATED_TYPES_MAPPING[deprecatedTypeName];
                        context.report({
                            data: { deprecatedTypeName, newTypeName },
                            messageId: "migration",
                            node,
                            fix: fixer => {
                                const fixes = new FixList();
                                fixes.addFixes(fixer.replaceText(node.expression, newTypeName));
                                const program = getProgram(node);
                                if (program !== undefined) {
                                    fixes.addFixes(
                                        replaceImportInFile(
                                            program,
                                            deprecatedTypeName,
                                            newTypeName,
                                            NEW_TYPE_PACKAGE_MAPPING[newTypeName],
                                        )(fixer),
                                    );
                                }
                                return fixes.getFixes();
                            },
                        });
                    }
                }
            },

            "TSInterfaceHeritage MemberExpression": (node: TSESTree.MemberExpression) => {
                if (
                    node.property.type !== TSESTree.AST_NODE_TYPES.Identifier ||
                    node.object.type !== TSESTree.AST_NODE_TYPES.Identifier
                ) {
                    return;
                }

                if (isDeprecatedNamespacedTypeReference(node.object.name, node.property.name)) {
                    const deprecatedTypeName = node.property.name;
                    const newTypeName = DEPRECATED_TYPES_MAPPING[deprecatedTypeName];
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
