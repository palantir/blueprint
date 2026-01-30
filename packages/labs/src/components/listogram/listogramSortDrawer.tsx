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

import { AbstractPureComponent, Button, ButtonGroup, Classes, Radio, RadioGroup } from "@blueprintjs/core";

import { LISTOGRAM_DRAWER, LISTOGRAM_SORT_DRAWER_TYPE, LISTOGRAM_SORT_DRAWER_TYPES } from "./listogramClasses";
import type { ListogramSortProps } from "./listogramSortUtils";
import { ListogramSortDirection, ListogramSortKind } from "./listogramTypes";

export interface ListogramSortDrawerProps extends ListogramSortProps {
    hasSubtotals: boolean;
}

export class ListogramSortDrawer extends AbstractPureComponent<ListogramSortDrawerProps> {
    public render() {
        return (
            <div className={classNames(LISTOGRAM_DRAWER, Classes.TEXT_MUTED)}>
                <ButtonGroup variant="minimal">
                    <Button
                        active={this.props.sortDirection === ListogramSortDirection.ASCENDING}
                        icon="sort-asc"
                        onClick={this.handleSortAscButtonClick}
                    />
                    <Button
                        active={this.props.sortDirection === ListogramSortDirection.DESCENDING}
                        icon="sort-desc"
                        onClick={this.handleSortDescButtonClick}
                    />
                </ButtonGroup>
                {this.renderSortTypeToggles()}
            </div>
        );
    }

    private renderSortTypeToggles() {
        const { areTitlesSortable, hasSubtotals, sortKindLabels = {}, sortKind } = this.props;
        const { title = "Title", count = "Count", subtotal = "Subtotal" } = sortKindLabels;

        return (
            <RadioGroup
                className={LISTOGRAM_SORT_DRAWER_TYPES}
                selectedValue={sortKind}
                onChange={this.handleSortKindToggleClick}
            >
                {areTitlesSortable && (
                    <Radio className={LISTOGRAM_SORT_DRAWER_TYPE} label={title} value={ListogramSortKind.TITLE} />
                )}
                {hasSubtotals && (
                    <Radio className={LISTOGRAM_SORT_DRAWER_TYPE} label={subtotal} value={ListogramSortKind.SUBTOTAL} />
                )}
                <Radio className={LISTOGRAM_SORT_DRAWER_TYPE} label={count} value={ListogramSortKind.COUNT} />
            </RadioGroup>
        );
    }

    private handleSortKindToggleClick = (evt: React.FormEvent<HTMLInputElement>) => {
        if (evt.currentTarget.value !== this.props.sortKind) {
            this.props.onSortChange(evt.currentTarget.value as ListogramSortKind, this.props.sortDirection);
        }
    };

    private handleSortAscButtonClick = () => {
        if (this.props.sortDirection !== ListogramSortDirection.ASCENDING) {
            this.props.onSortChange(
                this.props.sortKind !== undefined ? this.props.sortKind : ListogramSortKind.COUNT,
                ListogramSortDirection.ASCENDING,
            );
        }
    };

    private handleSortDescButtonClick = () => {
        if (this.props.sortDirection !== ListogramSortDirection.DESCENDING) {
            this.props.onSortChange(
                this.props.sortKind !== undefined ? this.props.sortKind : ListogramSortKind.COUNT,
                ListogramSortDirection.DESCENDING,
            );
        }
    };
}
