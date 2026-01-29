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
import { LISTOGRAM_EXCLUDED, LISTOGRAM_ITEM_EXCLUDED, MULTI_LISTOGRAM } from "./listogramClasses";
import { getListogramSelectionComponent } from "./listogramSelectionUtils";
import {
    type IListogramSerieMetadata,
    type IMultiListogramItem,
    type ListogramItemId,
    ListogramSelectionKind,
    ListogramSelectionMode,
} from "./listogramTypes";
import { MultiListogramItem } from "./multiListogramItem";

export interface IMultiListogramProps extends ListogramSharedProps {
    /**
     * List items to be displayed one per row.
     */
    items: IMultiListogramItem[];

    /**
     * Metadata for each series. Items will only be displayed if
     * the `key`s matching the `key`s used in `items` are also passed
     * in this prop.
     */
    seriesMetadata: IListogramSerieMetadata[];

    /**
     * Whether to display 0 for items that are missing a value for a
     * specific serie and item.
     *
     * @default false
     */
    fillEmptyCounts?: boolean;

    /**
     * Whether to display a tooltip with the serie title (or key if
     * no title given) when hovering over count bars.
     *
     * @default true
     */
    showCountBarTooltip?: boolean;

    /**
     * Whether clicking on items should dismiss the popover containing this listogram.
     * This value is forwarded to `<MenuItem shouldDismissPopover>`.
     *
     * @default true
     */
    itemShouldDismissPopover?: boolean;
}

export interface IMultiListogramState {
    countTotal: number;
    selectionMode: ListogramSelectionMode | undefined;
}

export class MultiListogram extends React.PureComponent<IMultiListogramProps, IMultiListogramState> {
    public static defaultProps: Partial<IMultiListogramProps> = {
        defaultSelectionMode: ListogramSelectionMode.KEEPING,
        disableSelection: false,
        selectionKind: ListogramSelectionKind.MULTIPLE,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.MultiListogram`;

    public state = {
        countTotal: this.getCountTotal(this.props),
        selectionMode: this.props.selectionMode ?? this.props.defaultSelectionMode,
    };

    private get resolvedSelectionMode(): ListogramSelectionMode {
        return this.props.selectionKind === "single"
            ? ListogramSelectionMode.KEEPING
            : (this.state.selectionMode ?? ListogramSelectionMode.KEEPING);
    }

    public componentDidUpdate(prevProps: IMultiListogramProps) {
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
        const { items } = this.props;
        const { countTotal } = this.state;

        const hasSubtotals = items.some(multiItem =>
            multiItem.series.some(baseItem => baseItem.countSubtotal !== undefined),
        );

        return (
            <BaseListogram
                {...this.props}
                countTotal={countTotal}
                menuClassName={classNames(MULTI_LISTOGRAM, {
                    [LISTOGRAM_EXCLUDED]: this.resolvedSelectionMode === "excluding",
                })}
                hasSubtotals={hasSubtotals}
                sortProps={undefined} // disable sorting
                itemRenderer={this.getItemRenderer(items, hasSubtotals)}
                onSelectionModeChange={this.handleSetSelectionMode}
                selectionMode={this.resolvedSelectionMode}
            />
        );
    }

    private getItemRenderer = (maybeSortedItems: IMultiListogramItem[], hasSubtotals: boolean) => {
        return (
            selection: any,
            handleItemClick: (itemId: ListogramItemId, evt: React.MouseEvent<HTMLElement>) => void,
        ) => {
            const {
                fillEmptyCounts,
                selectionKind,
                seriesMetadata,
                showCountBarTooltip,
                showSelectionToggles,
                valueFormatter,
                itemShouldDismissPopover = true,
            } = this.props;
            const { countTotal } = this.state;

            return maybeSortedItems.map(
                (item: IMultiListogramItem, index: number, listItems: IMultiListogramItem[]) => {
                    const isSelected = selection.has(item.id);

                    const previousItem = listItems[index - 1];
                    const isFirstOfSelectionBlob = previousItem === undefined || !selection.has(previousItem.id);
                    const nextItem = listItems[index + 1];
                    const isLastOfSelectionBlob = nextItem === undefined || !selection.has(nextItem.id);

                    return (
                        <MultiListogramItem
                            countTotal={countTotal}
                            numItems={maybeSortedItems.length}
                            fillEmptyCounts={!!fillEmptyCounts}
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
                            seriesMetadata={seriesMetadata}
                            showCountBarTooltip={showCountBarTooltip === undefined ? true : showCountBarTooltip}
                            showSubTotal={hasSubtotals}
                            textClassName={classNames({
                                [LISTOGRAM_ITEM_EXCLUDED]:
                                    isSelected && this.resolvedSelectionMode === ListogramSelectionMode.EXCLUDING,
                            })}
                            valueFormatter={valueFormatter}
                            shouldDismissPopover={itemShouldDismissPopover}
                        />
                    );
                },
            );
        };
    };

    private getCountTotal(props: IMultiListogramProps) {
        const allCounts: number[] = [];
        props.items.forEach(multiItem => allCounts.push(...multiItem.series.map(serieItem => serieItem.count)));
        return props.countTotal || Math.max(...allCounts);
    }

    private handleSetSelectionMode = (selectionMode: ListogramSelectionMode) => {
        if (this.props.selectionMode === undefined) {
            this.setState({ selectionMode });
        }
        this.props.onSelectionModeChange?.(selectionMode);
    };
}
