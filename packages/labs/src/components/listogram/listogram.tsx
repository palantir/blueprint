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

import { AbstractPureComponent } from "@blueprintjs/core";

import { DISPLAYNAME_PREFIX } from "../../common/props";

import { BaseListogram, type ListogramSharedProps } from "./baseListogram";
import { LISTOGRAM_EXCLUDED, LISTOGRAM_ITEM_EXCLUDED } from "./listogramClasses";
import { ListogramItem } from "./listogramItem";
import { getListogramSelectionComponent } from "./listogramSelectionUtils";
import { type ListogramSortProps, sortItems } from "./listogramSortUtils";
import {
    type ListogramItem as ListogramItemType,
    type ListogramItemId,
    ListogramSelectionKind,
    ListogramSelectionIntent,
    type ListogramSortDirection,
    type ListogramSortKind,
    ListogramSortDirection as SortDirection,
} from "./listogramTypes";

export interface ListogramProps extends ListogramSharedProps {
    /**
     * List items to be displayed one per row.
     */
    items: ListogramItemType[];

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

export interface ListogramState {
    countTotal: number;
    sortDirection: ListogramSortDirection;
    sortKind: ListogramSortKind | undefined;
    selectionIntent: ListogramSelectionIntent | undefined;
}

export class Listogram extends AbstractPureComponent<ListogramProps, ListogramState> {
    public static defaultProps: Partial<ListogramProps> = {
        defaultSelectionIntent: ListogramSelectionIntent.KEEPING,
        disableSelection: false,
        enableSorts: false,
        selectionKind: ListogramSelectionKind.MULTIPLE,
        showBars: true,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.Listogram`;

    public state = {
        countTotal: this.getCountTotal(this.props),
        selectionIntent: this.props.selectionIntent ?? this.props.defaultSelectionIntent,
        sortDirection: this.props.defaultSortDirection ?? SortDirection.DESCENDING,
        sortKind: this.props.defaultSortKind,
    };

    private getResolvedSelectionIntent(): ListogramSelectionIntent {
        return this.props.selectionKind === "single"
            ? ListogramSelectionIntent.KEEPING
            : (this.state.selectionIntent ?? ListogramSelectionIntent.KEEPING);
    }

    public componentDidUpdate(prevProps: ListogramProps) {
        const shouldUpdateCountTotal =
            prevProps.countTotal !== this.props.countTotal ||
            (prevProps.items !== this.props.items && prevProps.countTotal === undefined);
        if (shouldUpdateCountTotal) {
            this.setState({
                countTotal: this.getCountTotal(this.props),
            });
        }

        if (prevProps.selectionIntent !== this.props.selectionIntent) {
            this.setState({ selectionIntent: this.props.selectionIntent });
        } else if (prevProps.defaultSelectionIntent !== this.props.defaultSelectionIntent) {
            // reset intent to the new default
            this.setState({ selectionIntent: this.props.defaultSelectionIntent });
        }
    }

    public render() {
        const { enableSorts, items } = this.props;
        const { countTotal, sortDirection, sortKind } = this.state;

        const maybeSortedItems =
            enableSorts && sortKind !== undefined ? sortItems(items, sortDirection, sortKind) : items;
        const sortProps: ListogramSortProps = {
            onSortChange: this.handleSortChange,
            sortDirection,
            sortKind,
            sortKindLabels: this.props.labels?.sortKind,
        };

        const resolvedSelectionIntent = this.getResolvedSelectionIntent();

        return (
            <BaseListogram
                {...this.props}
                countTotal={countTotal}
                menuClassName={classNames({
                    [LISTOGRAM_EXCLUDED]: resolvedSelectionIntent === "excluding",
                })}
                sortProps={enableSorts ? sortProps : undefined}
                itemRenderer={this.getItemRenderer(maybeSortedItems)}
                defaultShowAllItems={this.props.defaultShowAllItems}
                visibleItemLimit={this.props.visibleItemLimit}
                onSelectionIntentChange={this.handleSetSelectionIntent}
                selectionIntent={resolvedSelectionIntent}
            />
        );
    }

    private getItemRenderer = (maybeSortedItems: ListogramItemType[]) => {
        return (
            selection: Set<ListogramItemId>,
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

            const resolvedSelectionIntent = this.getResolvedSelectionIntent();

            return maybeSortedItems.map((item: ListogramItemType, index: number, listItems: ListogramItemType[]) => {
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
                            resolvedSelectionIntent,
                        )}
                        textClassName={classNames({
                            [LISTOGRAM_ITEM_EXCLUDED]:
                                isSelected && resolvedSelectionIntent === ListogramSelectionIntent.EXCLUDING,
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

    private getCountTotal(props: ListogramProps) {
        return props.countTotal || Math.max(...props.items.map(i => i.count));
    }

    private handleSetSelectionIntent = (selectionIntent: ListogramSelectionIntent) => {
        if (this.props.selectionIntent === undefined) {
            this.setState({ selectionIntent });
        }
        this.props.onSelectionIntentChange?.(selectionIntent);
    };
}
