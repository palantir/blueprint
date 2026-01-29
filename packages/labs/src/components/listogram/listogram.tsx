/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { DISPLAYNAME_PREFIX } from "../../common/props";

import { BaseListogram, type ListogramSharedProps } from "./baseListogram";
import { LISTOGRAM_EXCLUDED, LISTOGRAM_ITEM_EXCLUDED } from "./listogramClasses";
import { ListogramItem } from "./listogramItem";
import { getListogramSelectionComponent } from "./listogramSelectionUtils";
import { areItemsTextComparable, type IListogramSortProps, sortItems } from "./listogramSortUtils";
import {
    type IListogramItem,
    ListogramDrawerKind,
    type ListogramItemId,
    ListogramSelectionKind,
    ListogramSelectionMode,
    type ListogramSortDirection,
    ListogramSortDirection as SortDirection,
    type ListogramSortKind,
} from "./listogramTypes";

export interface IListogramProps extends ListogramSharedProps {
    /**
     * List items to be displayed one per row.
     */
    items: IListogramItem[];

    /**
     * Enable both the appearance of the sorting menu for user-driven
     * sorting interactions and `defaultSortKind`/`defaultSortDirection` props.
     *
     * @default false
     */
    enableSorts?: boolean;

    /**
     * If visible item limit is set, this controls if the listogram is initially expanded or not.
     *
     * @default false
     */
    defaultShowAllItems?: boolean;

    /**
     * Which drawer is opened by default
     *
     * @default undefined
     */
    defaultOpenDrawer?: ListogramDrawerKind;

    /**
     * Default sort direction. Items will not be sorted unless
     * `defaultSortKind` is passed in and `enableSorts` is set to true.
     *
     * @default ListogramSortDirection.DESCENDING
     */
    defaultSortDirection?: ListogramSortDirection;

    /**
     * The default property of the listogram item to sort on. Items will not be
     * sorted unless `enableSorts` is set to true.
     */
    defaultSortKind?: ListogramSortKind;

    /**
     * Determines whether or not the histogram bars are shown alongside the count.
     *
     * @default true
     */
    showBars?: boolean;

    /**
     * Whether clicking on items should dismiss the popover containing this listogram.
     * This value is forwarded to `<MenuItem shouldDismissPopover>`.
     *
     * @default true
     */
    itemShouldDismissPopover?: boolean;

    /**
     * The number of items shown initially by the listogram. Items over the number
     * will be hidden behind a `View all` button.
     */
    visibleItemLimit?: number;
}

export interface IListogramState {
    countTotal: number;
    sortDirection: ListogramSortDirection;
    sortKind: ListogramSortKind | undefined;
    selectionMode: ListogramSelectionMode | undefined;
}

export class Listogram extends React.PureComponent<IListogramProps, IListogramState> {
    public static defaultProps: Partial<IListogramProps> = {
        defaultOpenDrawer: undefined,
        defaultSelectionMode: ListogramSelectionMode.KEEPING,
        disableSelection: false,
        enableSorts: false,
        selectionKind: ListogramSelectionKind.MULTIPLE,
        showBars: true,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.Listogram`;

    public state = {
        countTotal: this.getCountTotal(this.props),
        selectionMode: this.props.selectionMode ?? this.props.defaultSelectionMode,
        sortDirection: this.props.defaultSortDirection ?? SortDirection.DESCENDING,
        sortKind: this.props.defaultSortKind,
    };

    private get resolvedSelectionMode(): ListogramSelectionMode {
        return this.props.selectionKind === "single"
            ? ListogramSelectionMode.KEEPING
            : (this.state.selectionMode ?? ListogramSelectionMode.KEEPING);
    }

    public componentDidUpdate(prevProps: IListogramProps) {
        const shouldUpdateCountTotal =
            prevProps.countTotal !== this.props.countTotal ||
            (prevProps.items !== this.props.items && prevProps.countTotal === undefined);
        if (shouldUpdateCountTotal) {
            this.setState({
                countTotal: this.getCountTotal(this.props),
            });
        }

        if (prevProps.selectionMode !== this.props.selectionMode) {
            this.setState({ selectionMode: this.props.selectionMode });
        } else if (prevProps.defaultSelectionMode !== this.props.defaultSelectionMode) {
            // reset mode to the new default
            this.setState({ selectionMode: this.props.defaultSelectionMode });
        }
    }

    public render() {
        const { enableSorts, items } = this.props;
        const { countTotal, sortDirection, sortKind } = this.state;

        const hasSubtotals = items.some(item => item.countSubtotal !== undefined);
        const maybeSortedItems =
            enableSorts && sortKind !== undefined ? sortItems(items, sortDirection, sortKind) : items;
        const sortProps: IListogramSortProps = {
            areTitlesSortable: areItemsTextComparable(this.props.items),
            onSortChange: this.handleSortChange,
            sortDirection,
            sortKind,
            sortKindLabels: this.props.labels?.sortKind,
        };

        return (
            <BaseListogram
                {...this.props}
                countTotal={countTotal}
                menuClassName={classNames({
                    [LISTOGRAM_EXCLUDED]: this.resolvedSelectionMode === "excluding",
                })}
                hasSubtotals={hasSubtotals}
                sortProps={enableSorts ? sortProps : undefined}
                defaultOpenDrawer={this.props.defaultOpenDrawer}
                itemRenderer={this.getItemRenderer(maybeSortedItems, hasSubtotals)}
                defaultShowAllItems={this.props.defaultShowAllItems}
                visibleItemLimit={this.props.visibleItemLimit}
                onSelectionModeChange={this.handleSetSelectionMode}
                selectionMode={this.resolvedSelectionMode}
            />
        );
    }

    private getItemRenderer = (maybeSortedItems: IListogramItem[], hasSubtotals: boolean) => {
        return (
            selection: any,
            handleItemClick: (itemId: ListogramItemId, evt: React.MouseEvent<HTMLElement>) => void,
        ) => {
            const {
                selectionKind,
                showSelectionToggles,
                valueFormatter,
                showBars,
                itemShouldDismissPopover = true,
            } = this.props;
            const { countTotal } = this.state;

            return maybeSortedItems.map((item: IListogramItem, index: number, listItems: IListogramItem[]) => {
                const isSelected = selection.has(item.id);

                const previousItem = listItems[index - 1];
                const isFirstOfSelectionBlob = previousItem === undefined || !selection.has(previousItem.id);
                const nextItem = listItems[index + 1];
                const isLastOfSelectionBlob = nextItem === undefined || !selection.has(nextItem.id);

                return (
                    <ListogramItem
                        countTotal={countTotal}
                        numItems={maybeSortedItems.length}
                        showBar={showBars}
                        isFirstOfSelectionBlob={isFirstOfSelectionBlob}
                        isLastOfSelectionBlob={isLastOfSelectionBlob}
                        isSelected={isSelected}
                        item={item}
                        key={item.id}
                        onItemClick={handleItemClick}
                        selectionComponent={getListogramSelectionComponent(
                            showSelectionToggles ?? false,
                            selectionKind ?? ListogramSelectionKind.MULTIPLE,
                            this.resolvedSelectionMode,
                        )}
                        showSubTotal={hasSubtotals}
                        textClassName={classNames({
                            [LISTOGRAM_ITEM_EXCLUDED]:
                                isSelected && this.resolvedSelectionMode === ListogramSelectionMode.EXCLUDING,
                        })}
                        valueFormatter={valueFormatter}
                        shouldDismissPopover={itemShouldDismissPopover}
                    />
                );
            });
        };
    };

    private handleSortChange = (sortKind: ListogramSortKind, sortDirection: ListogramSortDirection) => {
        this.setState({ sortDirection, sortKind });
    };

    private getCountTotal(props: IListogramProps) {
        return props.countTotal || Math.max(...props.items.map(i => i.count));
    }

    private handleSetSelectionMode = (selectionMode: ListogramSelectionMode) => {
        if (this.props.selectionMode === undefined) {
            this.setState({ selectionMode });
        }
        this.props.onSelectionModeChange?.(selectionMode);
    };
}
