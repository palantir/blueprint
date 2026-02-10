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

import { AbstractPureComponent, Classes, Text } from "@blueprintjs/core";

import { CountBar, ListogramBaseItem } from "./listogramBaseItem";
import {
    LISTOGRAM_ITEM_BAR_HIDDEN,
    LISTOGRAM_ITEM_BARS,
    LISTOGRAM_ITEM_COUNT,
    LISTOGRAM_ITEM_TEXT,
    LISTOGRAM_ITEM_TEXT_WRAPPER,
} from "./listogramClasses";
import type { ListogramItemSharedProps } from "./listogramItemProps";
import type { ListogramItem as ListogramItemType } from "./listogramTypes";

export interface ListogramItemProps extends ListogramItemSharedProps {
    /**
     * Information about how to render this single listogram item.
     */
    item: ListogramItemType;
}

export class ListogramItem extends AbstractPureComponent<ListogramItemProps> {
    public render() {
        const { showBar } = this.props;

        return (
            <ListogramBaseItem
                {...this.props}
                renderBars={this.renderBars}
                renderText={this.renderText}
                menuItemClassName={classNames({
                    [LISTOGRAM_ITEM_BAR_HIDDEN]: !showBar,
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
                {this.renderCountValue()}
            </div>
        );
    };

    private renderCountValue = () => {
        const { countDisplayValue, count } = this.props.item;
        const className = classNames(LISTOGRAM_ITEM_COUNT, Classes.TEXT_MUTED);

        if (countDisplayValue != null) {
            return <span className={className}>{countDisplayValue}</span>;
        }

        return <span className={className}>{this.formatValue(count)}</span>;
    };

    private renderBars = () => {
        const {
            countTotal,
            item: { count },
            showBar,
        } = this.props;

        if (!showBar) {
            return null;
        }

        return (
            <div className={LISTOGRAM_ITEM_BARS}>
                <CountBar count={count} total={countTotal} />
            </div>
        );
    };

    private formatValue(value: number): React.ReactNode {
        const { valueFormatter } = this.props;
        return valueFormatter ? valueFormatter(value) : value;
    }
}
