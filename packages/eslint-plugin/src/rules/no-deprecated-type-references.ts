/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

// tslint:disable object-literal-sort-keys

import { TSESTree } from "@typescript-eslint/utils";

import { createRule } from "./utils/createRule";

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

const DEPRECATED_TYPE_REFERENCES = [
    // core
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

    // datetime
    "IDateFormatProps",
    "IDateInputProps",
    "IDatePickerProps",
    "IDatePickerModifiers",
    "IDateRangeInputProps",
    "IDateRangeShortcut",
    "ITimePickerProps",

    // docs-theme
    "IExampleProps",
    "INavMenuItemProps",
    "ITagRendererMap",

    // popover2
    "IPopover2Props",
    "IPopover2TargetProps",
    "IPopover2SharedProps",
    "ITooltip2Props",

    // select
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

    // table
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

    // timezone
    "ITimezoneItem",
    "ITimezonePickerProps",
];

const DEPRECATED_TYPES_MAPPING = DEPRECATED_TYPE_REFERENCES.reduce<Record<string, string>>(
    (mapping, deprecatedSymbol) => {
        // "IProps": "Props"
        mapping[deprecatedSymbol] = deprecatedSymbol.slice(1);
        return mapping;
    },
    {
        // some extra type mappings which do not fit the simple pattern of dropping the "I" prefix
        IPortalContext: "PortalLegacyContext",
        IToaster: "ToasterInstance",
        ITreeNode: "TreeNodeInfo",
        ContextMenu2RenderProps: "ContextMenu2ContentProps",
    },
);

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
        messages: {
            migration: "Usage of {{ deprecatedType }} is deprecated, migrate to {{ newType }} instead",
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
                            context.report({
                                data: {
                                    deprecatedType: node.typeName.name,
                                    newType: DEPRECATED_TYPES_MAPPING[node.typeName.name],
                                },
                                messageId: "migration",
                                node,
                            });
                        }
                        return;
                    case TSESTree.AST_NODE_TYPES.TSQualifiedName:
                        // only deal with one level of chaining in a qualified name, like "BP.DeprecatedInterface"
                        if (
                            node.typeName.left.type === TSESTree.AST_NODE_TYPES.Identifier &&
                            isDeprecatedNamespacedTypeReference(node.typeName.left.name, node.typeName.right.name)
                        ) {
                            context.report({
                                data: {
                                    deprecatedType: node.typeName.right.name,
                                    newType: DEPRECATED_TYPES_MAPPING[node.typeName.right.name],
                                },
                                messageId: "migration",
                                node,
                            });
                        }
                        return;
                }
            },

            TSInterfaceHeritage: (node: TSESTree.TSInterfaceHeritage) => {
                if (node.expression.type === TSESTree.AST_NODE_TYPES.Identifier) {
                    if (isDeprecatedTypeReference(node.expression.name)) {
                        context.report({
                            data: {
                                deprecatedType: node.expression.name,
                                newType: DEPRECATED_TYPES_MAPPING[node.expression.name],
                            },
                            messageId: "migration",
                            node,
                        });
                    }
                }
            },
        };
    },
});
