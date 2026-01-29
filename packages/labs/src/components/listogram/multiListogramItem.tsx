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

import { Classes, Text, Tooltip } from "@blueprintjs/core";

import { CountBar, ListogramBaseItem } from "./listogramBaseItem";
import {
    LISTOGRAM_ITEM_BAR_TOOLTIP,
    LISTOGRAM_ITEM_BAR_WITH_SERIE_COLOR,
    LISTOGRAM_ITEM_BARS,
    LISTOGRAM_ITEM_COUNT,
    LISTOGRAM_ITEM_COUNT_DISPLAY_VALUE_WRAPPER,
    LISTOGRAM_ITEM_COUNT_SUBTOTAL,
    LISTOGRAM_ITEM_COUNT_WITH_SERIE_COLOR,
    LISTOGRAM_ITEM_COUNT_WRAPPER,
    LISTOGRAM_ITEM_COUNT_WRAPPER_SHOWING_SUBTOTAL,
    LISTOGRAM_ITEM_SHOWING_MULTIPLE_SERIES,
    LISTOGRAM_ITEM_TEXT,
    LISTOGRAM_ITEM_TEXT_WRAPPER,
} from "./listogramClasses";
import type { ListogramItemSharedProps } from "./listogramItemProps";
import type { IListogramSerieItem, IListogramSerieMetadata, IMultiListogramItem } from "./listogramTypes";
import { createSerieKeyToBaseItemMap } from "./multiListogramUtils";

export interface IMultiListogramItemProps extends ListogramItemSharedProps {
    /**
     * Information about how to render this single listogram item.
     */
    item: IMultiListogramItem;

    /**
     * Information about additional series to render for this ListogramItem.
     */
    seriesMetadata: IListogramSerieMetadata[];

    fillEmptyCounts: boolean;

    showCountBarTooltip: boolean;
}

export class MultiListogramItem extends React.PureComponent<IMultiListogramItemProps> {
    public render() {
        const { fillEmptyCounts, item, seriesMetadata } = this.props;
        const serieKeyToBaseItem = createSerieKeyToBaseItemMap(item);
        const numSeries = seriesMetadata.filter(serie => serieKeyToBaseItem[serie.key] !== undefined);

        return (
            <ListogramBaseItem
                {...this.props}
                renderBars={this.renderBars}
                renderText={this.renderText}
                menuItemClassName={classNames({
                    [LISTOGRAM_ITEM_SHOWING_MULTIPLE_SERIES]:
                        numSeries.length > 1 || (fillEmptyCounts && seriesMetadata.length > 1),
                })}
            />
        );
    }

    private renderText = (title: React.ReactNode) => {
        return (
            <div className={LISTOGRAM_ITEM_TEXT_WRAPPER}>
                <Text
                    className={classNames(Classes.FILL, LISTOGRAM_ITEM_TEXT, this.props.textClassName)}
                    ellipsize={true}
                >
                    {title}
                </Text>
                {this.renderCountValues()}
            </div>
        );
    };

    private renderCountValues = () => {
        const { item, seriesMetadata, showSubTotal } = this.props;
        const className = classNames(LISTOGRAM_ITEM_COUNT, Classes.TEXT_MUTED, {
            [LISTOGRAM_ITEM_COUNT_WRAPPER_SHOWING_SUBTOTAL]: showSubTotal,
        });

        const serieKeyToBaseItem = createSerieKeyToBaseItemMap(item);

        const renderCountValue = this.getRenderCountValue(
            className,
            serieKeyToBaseItem,
            item,
            showSubTotal,
            seriesMetadata.length,
        );

        return <div className={LISTOGRAM_ITEM_COUNT_WRAPPER}>{seriesMetadata.map(renderCountValue)}</div>;
    };

    private getRenderCountValue(
        className: string,
        serieKeyToBaseItem: { [key: string]: IListogramSerieItem },
        item: IMultiListogramItem,
        showSubTotal: boolean,
        numSeries: number,
    ) {
        return (serieMetadata: IListogramSerieMetadata) => {
            const baseItem = serieKeyToBaseItem[serieMetadata.key];
            const count = baseItem !== undefined ? baseItem.count : 0;

            // Use style=color if color is passed, otherwise color the subtotal or count using
            // `LISTOGRAM_ITEM_COUNT_WITH_SERIE_COLOR` class
            const color = serieMetadata.color !== undefined ? serieMetadata.color : "";
            const key = `id: ${item.id}, series: ${serieMetadata.key}`;

            if (baseItem !== undefined && baseItem.countDisplayValue !== undefined) {
                return (
                    <span
                        key={key}
                        className={classNames(className, LISTOGRAM_ITEM_COUNT_DISPLAY_VALUE_WRAPPER, {
                            [LISTOGRAM_ITEM_COUNT_WITH_SERIE_COLOR]: color !== "",
                        })}
                        style={{ color: `${color}` }}
                    >
                        {baseItem.countDisplayValue}
                    </span>
                );
            } else if (baseItem === undefined && !this.props.fillEmptyCounts) {
                return <div key={key} />;
            }
            return (
                <span key={key} className={className}>
                    {showSubTotal && (
                        <span
                            className={classNames(LISTOGRAM_ITEM_COUNT_SUBTOTAL, LISTOGRAM_ITEM_COUNT_WITH_SERIE_COLOR)}
                            style={{ color: `${color}` }}
                        >
                            {this.formatValue(baseItem !== undefined ? (baseItem.countSubtotal ?? 0) : 0)}
                        </span>
                    )}
                    {showSubTotal && <span>&nbsp;/&nbsp;</span>}
                    <span
                        className={classNames({
                            [LISTOGRAM_ITEM_COUNT_WITH_SERIE_COLOR]: numSeries > 1 && !showSubTotal,
                        })}
                        style={{ color: `${!showSubTotal ? color : ""}` }}
                    >
                        {this.formatValue(count)}
                    </span>
                </span>
            );
        };
    }

    private renderBars = () => {
        const { countTotal, item, seriesMetadata, showSubTotal, showCountBarTooltip } = this.props;

        const serieKeyToBaseItem = createSerieKeyToBaseItemMap(item);

        const renderBar = this.getRenderBar(serieKeyToBaseItem, item, countTotal, showSubTotal, showCountBarTooltip);

        return seriesMetadata.map(renderBar);
    };

    private getRenderBar(
        serieKeyToBaseItem: { [key: string]: IListogramSerieItem },
        item: IMultiListogramItem,
        countTotal: number,
        showSubTotal: boolean,
        showCountBarTooltip: boolean,
    ) {
        return (serieMetadata: IListogramSerieMetadata) => {
            const baseItem = serieKeyToBaseItem[serieMetadata.key];
            const color = serieMetadata.color !== undefined ? serieMetadata.color : "";
            const count = baseItem !== undefined ? baseItem.count : 0;
            const subCount = showSubTotal && baseItem !== undefined ? baseItem.countSubtotal : undefined;

            if (baseItem === undefined && !this.props.fillEmptyCounts) {
                return <span />;
            }

            const countBarWidthPercentage = Math.round((count * 100) / countTotal);
            const countBars = (
                <div>
                    <CountBar
                        count={count}
                        total={countTotal}
                        color={!showSubTotal ? color : ""}
                        className={classNames({
                            [LISTOGRAM_ITEM_COUNT_SUBTOTAL]: showSubTotal,
                            [LISTOGRAM_ITEM_BAR_WITH_SERIE_COLOR]: !showSubTotal,
                        })}
                    />
                    {showSubTotal && subCount !== undefined && (
                        <CountBar
                            count={subCount}
                            total={countTotal}
                            color={color}
                            className={LISTOGRAM_ITEM_BAR_WITH_SERIE_COLOR}
                        />
                    )}{" "}
                </div>
            );

            // The inner div (with style={{ width: `${countBarWidthPercentage}%` }} ) is necessary
            // in order for the tooltip to be sized to only the filled bar and display immediately
            // to the right of that filled bar.

            return (
                <div key={`id: ${item.id}, series: ${serieMetadata.key}`} className={LISTOGRAM_ITEM_BARS}>
                    <div style={{ width: `${countBarWidthPercentage}%` }}>
                        {showCountBarTooltip ? (
                            <Tooltip
                                className={LISTOGRAM_ITEM_BAR_TOOLTIP}
                                content={serieMetadata.title || serieMetadata.key}
                                placement="right"
                                rootBoundary="document"
                                targetTagName="div"
                            >
                                {countBars}
                            </Tooltip>
                        ) : (
                            countBars
                        )}
                    </div>
                </div>
            );
        };
    }

    private formatValue(value: number): React.ReactChild {
        const { valueFormatter } = this.props;
        return valueFormatter ? valueFormatter(value) : value;
    }
}
