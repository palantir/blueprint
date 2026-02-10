/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent, Button, Menu, type Props } from "@blueprintjs/core";

import { DISPLAYNAME_PREFIX } from "../../common/props";

import { LISTOGRAM, LISTOGRAM_EXPAND_BUTTON } from "./listogramClasses";
import { ListogramHeader } from "./listogramHeader";
import {
    updateListogramSelectionMultiple,
    updateListogramSelectionSingle,
    updateListogramSelectionToggle,
} from "./listogramSelectionUtils";
import type { ListogramSortProps } from "./listogramSortUtils";
import {
    type ListogramItemGroupBase,
    type ListogramItemId,
    type ListogramLabels,
    type ListogramSelectionState,
    ListogramSelectionKind,
    type ListogramSelectionIntent,
} from "./listogramTypes";

export interface ListogramSharedProps extends Props {
    /**
     * Callback triggered when an item is clicked.
     */
    onItemClick?: (evt: React.MouseEvent<HTMLElement>, itemId: ListogramItemId) => void;

    /**
     * The currently selected items. Passing this prop puts the listogram in
     * controlled mode, where the only way to change the selection is by
     * updating this property. Use `onSelectionChange` to listen for changes
     * to this set.
     */
    selectedItemIds?: Set<ListogramItemId>;

    /**
     * Callback triggered whenever the selection changes due to user interaction.
     */
    onSelectionChange?: (nextSelectedItemIds: Set<ListogramItemId>) => void;

    /**
     * The selection behavior.
     *
     * @default ListogramSelectionKind.MULTIPLE
     */
    selectionKind?: ListogramSelectionKind;

    /**
     * Whether selection should be represented with a checkbox (`true`) or via
     * background color (`false`). If `true`, a checkbox is used for toggle or
     * multiple selection and a radio button is used for single selection.
     *
     * @default false
     */
    showSelectionToggles?: boolean;

    /**
     * Whether changes to selection are disabled. When this prop is `true`,
     * `onSelectionChange` events will _never_ fire, but `selectedItemIds` will
     * still be rendered as expected.
     *
     * @default false
     */
    disableSelection?: boolean;

    /**
     * The maximum value used to scale bar widths. Each item's bar width is
     * calculated as `(item.count / countTotal) * 100%`. Defaults to the
     * maximum count across all items. Useful when multiple Listograms
     * should share the same scale for visual comparison.
     */
    countTotal?: number;

    /**
     * Header text above list of items. Set this prop if you want the header
     * (which includes the sort menu) to render. `defaultSortKind` and `defaultSortDirection`
     * will still work as long as `enableSorts` is set.
     */
    title?: React.ReactNode;

    /**
     * Apply a formatter to the values in the listogram. By default, values
     * will be displayed as plain numbers without formatting.
     */
    valueFormatter?: (value: number) => React.ReactNode;

    /**
     * Labels text for various UI elements which may be overridden for localization/i18n in non-English environments.
     */
    labels?: ListogramLabels;

    /**
     * Default listogram selection intent (uncontrolled usage).
     *
     * @default ListogramSelectionIntent.KEEPING
     */
    defaultSelectionIntent?: ListogramSelectionIntent;

    /**
     * Callback invoked when the user changes the selection intent through the UI.
     */
    onSelectionIntentChange?: (intent: ListogramSelectionIntent) => void;

    /**
     * Listogram selection intent (controlled usage).
     *
     * @default undefined
     */
    selectionIntent?: ListogramSelectionIntent;
}

// `ListogramSharedProps` are the props that `Listogram`s *props* extend,
// whereas `BaseListogramProps` are the props used by the
// `BaseListogram` *component* that the other `Listogram`s extend.
export interface BaseListogramProps extends ListogramSharedProps {
    /**
     * An ItemGroup has one id and label, but potentially multiple counts.
     * Referred to as an "item" in general. In the UI, each item is one
     * unified row that the user can interact with.
     */
    items: ListogramItemGroupBase[];

    /**
     * The maximum value used to scale bar widths across all item groups
     * and series.
     */
    countTotal: number;

    /**
     * Optional class name to pass to the Menu element within which
     * the items are rendered.
     */
    menuClassName?: string;

    /**
     * If the listogram is expanded to show all items. Only applicable if visibleItemLimit is set.
     */
    defaultShowAllItems?: boolean;

    /**
     * Information related to how to sort items.
     */
    sortProps: ListogramSortProps | undefined;

    /**
     * The number of items shown initially by the listogram. Items over the number
     * will be hidden behind a `View all` button.
     */
    visibleItemLimit?: number;

    /**
     * Function that renders each item within this listogram.
     */
    itemRenderer: (
        selection: Set<ListogramItemId>,
        handleItemClick: (itemId: ListogramItemId, evt: React.MouseEvent<HTMLElement>) => void,
    ) => React.JSX.Element[];
}

export interface BaseListogramState {
    selectionState: ListogramSelectionState;
    showAllItems: boolean | undefined;
}

export class BaseListogram extends AbstractPureComponent<BaseListogramProps, BaseListogramState> {
    public static defaultProps = {
        defaultShowAllItems: true,
        enableSorts: false,
        isSelectionDisabled: false,
        selectionKind: ListogramSelectionKind.MULTIPLE,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.BaseListogram`;

    public state = {
        selectionState: getSelectionState(this.props),
        showAllItems: this.props.defaultShowAllItems,
    };

    public componentDidUpdate() {
        if (isControlled(this.props)) {
            this.setState((prevState: BaseListogramState) => {
                if (this.props.selectedItemIds !== prevState.selectionState.selectedItemIds) {
                    // if in controlled mode the consumer passes in a selection different from
                    // what the internally calculated next selection would be, clear away internal
                    // state values previouslyClickedId and shiftSelection which no longer makes sense
                    return {
                        ...prevState,
                        selectionState: getSelectionState(this.props),
                    };
                } else {
                    return prevState;
                }
            });
        }
    }

    public render() {
        const { className, items, menuClassName, selectedItemIds, selectionKind, sortProps, title, visibleItemLimit } =
            this.props;
        const { selectionState, showAllItems } = this.state;

        const selection = selectedItemIds || selectionState.selectedItemIds;
        const shouldShowExpandButton = visibleItemLimit != null;
        const boundedVisibleItemLimit =
            showAllItems || visibleItemLimit == null || visibleItemLimit < 0 ? items.length : visibleItemLimit;

        return (
            <Menu
                className={classNames(LISTOGRAM, className, menuClassName)}
                role="listbox"
                // aria-multiselectable appears to make macOS VoiceOver read "selected" an extra time, but should be
                // included according to the spec, and does this on official documentation pages as well.
                aria-multiselectable={selectionKind === ListogramSelectionKind.MULTIPLE}
            >
                {title !== undefined && <ListogramHeader sortProps={sortProps} title={title} />}
                {this.props.itemRenderer(selection, this.handleItemClick).slice(0, boundedVisibleItemLimit)}
                {shouldShowExpandButton && (
                    <Button
                        className={LISTOGRAM_EXPAND_BUTTON}
                        onClick={this.toggleShowAllItems}
                        variant="minimal"
                        text={showAllItems ? "View less" : `View all (${this.props.items.length})`}
                    />
                )}
            </Menu>
        );
    }

    private handleItemClick = (itemId: ListogramItemId, evt: React.MouseEvent<HTMLElement>) => {
        this.updateSelection(itemId, evt);
        this.props.onItemClick?.(evt, itemId);
    };

    private toggleShowAllItems = () => {
        this.setState(({ showAllItems }) => ({ showAllItems: !showAllItems }));
    };

    private updateSelection = (itemId: ListogramItemId, evt: React.MouseEvent<HTMLElement>) => {
        const { disableSelection, items, onSelectionChange, selectionKind, showSelectionToggles } = this.props;

        if (disableSelection) {
            return;
        }

        this.setState(
            prevState => {
                let newSelectionState: ListogramSelectionState | undefined;
                if (selectionKind === ListogramSelectionKind.SINGLE) {
                    newSelectionState = updateListogramSelectionSingle(prevState.selectionState, itemId);
                } else if (selectionKind === ListogramSelectionKind.TOGGLE) {
                    newSelectionState = updateListogramSelectionToggle(prevState.selectionState, itemId);
                } else if (selectionKind === ListogramSelectionKind.MULTIPLE) {
                    newSelectionState = updateListogramSelectionMultiple(
                        prevState.selectionState,
                        itemId,
                        items,
                        showSelectionToggles ?? false,
                        evt,
                    );
                }

                if (newSelectionState !== undefined) {
                    return { ...prevState, selectionState: newSelectionState };
                } else {
                    return prevState;
                }
            },
            // Called after state is updated so if the consumer passes in the state we return to them
            // we have preserved the shiftSelection & previouslyClickedId
            () => onSelectionChange?.(this.state.selectionState.selectedItemIds),
        );
    };
}

function getSelectionState(props: ListogramSharedProps): ListogramSelectionState {
    return {
        previouslyClickedId: undefined,
        selectedItemIds: props.selectedItemIds || new Set<ListogramItemId>(),
        shiftSelection: new Set<ListogramItemId>(),
    };
}

function isControlled(props: ListogramSharedProps) {
    return props.selectedItemIds !== undefined;
}
