/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import classNames from "classnames";
import * as React from "react";

import { Classes, ContextMenu, Text } from "@blueprintjs/core";

import { CountBar, ListogramBaseItem } from "./listogramBaseItem";
import {
    LISTOGRAM_ITEM_BAR_HIDDEN,
    LISTOGRAM_ITEM_BARS,
    LISTOGRAM_ITEM_COUNT,
    LISTOGRAM_ITEM_COUNT_SUBTOTAL,
    LISTOGRAM_ITEM_COUNT_TOTAL,
    LISTOGRAM_ITEM_TEXT,
    LISTOGRAM_ITEM_TEXT_WRAPPER,
} from "./listogramClasses";
import type { ListogramItemSharedProps } from "./listogramItemProps";
import type { IListogramItem } from "./listogramTypes";

export interface IListogramItemProps extends ListogramItemSharedProps {
    /**
     * Information about how to render this single listogram item.
     */
    item: IListogramItem;
}

export class ListogramItem extends React.PureComponent<IListogramItemProps> {
    public render() {
        const { showBar, item } = this.props;
        // iff the item is disabled: override ContextMenuProps to disable the context menu
        const contextMenuDisabled = item.disabled === true ? true : item.contextMenu?.disabled;

        return (
            <ContextMenu
                content={item.contextMenu?.content}
                {...item.contextMenu}
                disabled={contextMenuDisabled}
            >
                <ListogramBaseItem
                    {...this.props}
                    renderBars={this.renderBars}
                    renderText={this.renderText}
                    menuItemClassName={classNames({
                        [LISTOGRAM_ITEM_BAR_HIDDEN]: !showBar,
                    })}
                />
            </ContextMenu>
        );
    }

    private renderText = (title: React.ReactNode) => {
        // TODO: Add ability to add class to text component here so we don't have
        // to have the extra LISTOGRAM_ITEM_TEXT_WRAPPER DOM el here.

        return (
            <div className={LISTOGRAM_ITEM_TEXT_WRAPPER}>
                <Text
                    className={classNames(Classes.FILL, LISTOGRAM_ITEM_TEXT, this.props.textClassName)}
                    ellipsize={true}
                >
                    {title}
                </Text>
                {this.renderCountValue()}
            </div>
        );
    };

    private renderCountValue = () => {
        const { countDisplayValue, count } = this.props.item;
        const className = classNames(LISTOGRAM_ITEM_COUNT, Classes.TEXT_MUTED);

        const subCount = this.props.showSubTotal ? this.props.item.countSubtotal || 0 : undefined;

        if (countDisplayValue != null) {
            return <span className={className}>{countDisplayValue}</span>;
        }

        return (
            <span className={className}>
                {subCount != null && (
                    <span className={LISTOGRAM_ITEM_COUNT_SUBTOTAL}>{this.formatValue(subCount)}</span>
                )}
                {subCount != null && <span>&nbsp;/&nbsp;</span>}
                {this.formatValue(count)}
            </span>
        );
    };

    private renderBars = () => {
        const {
            countTotal,
            item: { count },
            showBar,
            showSubTotal,
        } = this.props;

        if (!showBar) {
            return null;
        }

        return (
            <div className={LISTOGRAM_ITEM_BARS}>
                <CountBar
                    count={count}
                    total={countTotal}
                    className={classNames({
                        [LISTOGRAM_ITEM_COUNT_TOTAL]: showSubTotal,
                    })}
                />

                {showSubTotal && (
                    <CountBar
                        count={this.props.item.countSubtotal ?? 0}
                        total={countTotal}
                        className={classNames({
                            [LISTOGRAM_ITEM_COUNT_SUBTOTAL]: showSubTotal,
                        })}
                    />
                )}
            </div>
        );
    };

    private formatValue(value: number): React.ReactChild {
        const { valueFormatter } = this.props;
        return valueFormatter ? valueFormatter(value) : value;
    }
}
