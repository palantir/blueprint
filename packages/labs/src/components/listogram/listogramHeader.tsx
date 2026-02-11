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

import * as React from "react";

import { AbstractPureComponent, Button, ButtonGroup, H6, InputGroup, Popover, Tooltip } from "@blueprintjs/core";

import {
    LISTOGRAM_HEADER,
    LISTOGRAM_HEADER_TITLE,
    LISTOGRAM_SEARCH_BUTTON,
    LISTOGRAM_SEARCH_INPUT,
    LISTOGRAM_SORT_CONTROLS_BUTTON,
    LISTOGRAM_SORT_CONTROLS_POPOVER,
} from "./listogramClasses";
import type { ListogramSortProps } from "./listogramSortUtils";
import { ListogramSortDirection, ListogramSortKind } from "./listogramTypes";

export interface ListogramSearchProps {
    searchQuery: string;
    isSearchOpen: boolean;
    onSearchQueryChange: (query: string) => void;
    onSearchToggle: () => void;
    onSearchClear: () => void;
}

export interface ListogramHeaderProps {
    searchProps: ListogramSearchProps | undefined;
    sortProps: ListogramSortProps | undefined;
    title: React.ReactNode;
}

export class ListogramHeader extends AbstractPureComponent<ListogramHeaderProps> {
    public render() {
        const { searchProps, sortProps, title } = this.props;

        const enableSearch = searchProps !== undefined;
        const enableSorts = sortProps !== undefined;

        return (
            <div className={LISTOGRAM_HEADER}>
                <H6 className={LISTOGRAM_HEADER_TITLE}>
                    {title}
                    <div>
                        {enableSearch && (
                            <Button
                                active={searchProps.isSearchOpen}
                                className={LISTOGRAM_SEARCH_BUTTON}
                                icon="search"
                                onClick={searchProps.onSearchToggle}
                                variant="minimal"
                            />
                        )}
                        {enableSorts && (
                            <Popover content={this.renderSortPopoverContent(sortProps)} placement="auto">
                                <Button className={LISTOGRAM_SORT_CONTROLS_BUTTON} icon="sort" variant="minimal" />
                            </Popover>
                        )}
                    </div>
                </H6>
                {enableSearch && searchProps.isSearchOpen && (
                    <InputGroup
                        autoFocus={true}
                        className={LISTOGRAM_SEARCH_INPUT}
                        placeholder="Filter..."
                        value={searchProps.searchQuery}
                        onChange={this.handleSearchInputChange}
                        rightElement={
                            <Button
                                aria-label="Clear filter query"
                                icon="cross"
                                onClick={searchProps.onSearchClear}
                                variant="minimal"
                            />
                        }
                    />
                )}
            </div>
        );
    }

    private renderSortPopoverContent(sortProps: ListogramSortProps) {
        const { sortDirection, sortKind, onSortChange } = sortProps;

        return (
            <div className={LISTOGRAM_SORT_CONTROLS_POPOVER}>
                <ButtonGroup variant="minimal">
                    <Tooltip content="Sort by title, ascending">
                        <Button
                            active={
                                sortKind === ListogramSortKind.TITLE &&
                                sortDirection === ListogramSortDirection.ASCENDING
                            }
                            icon="sort-asc"
                            onClick={() => onSortChange(ListogramSortKind.TITLE, ListogramSortDirection.ASCENDING)}
                        />
                    </Tooltip>
                    <Tooltip content="Sort by title, descending">
                        <Button
                            active={
                                sortKind === ListogramSortKind.TITLE &&
                                sortDirection === ListogramSortDirection.DESCENDING
                            }
                            icon="sort-desc"
                            onClick={() => onSortChange(ListogramSortKind.TITLE, ListogramSortDirection.DESCENDING)}
                        />
                    </Tooltip>
                    <Tooltip content="Sort by count, ascending">
                        <Button
                            active={
                                sortKind === ListogramSortKind.COUNT &&
                                sortDirection === ListogramSortDirection.ASCENDING
                            }
                            icon="sort-numerical"
                            onClick={() => onSortChange(ListogramSortKind.COUNT, ListogramSortDirection.ASCENDING)}
                        />
                    </Tooltip>
                    <Tooltip content="Sort by count, descending">
                        <Button
                            active={
                                sortKind === ListogramSortKind.COUNT &&
                                sortDirection === ListogramSortDirection.DESCENDING
                            }
                            icon="sort-numerical-desc"
                            onClick={() => onSortChange(ListogramSortKind.COUNT, ListogramSortDirection.DESCENDING)}
                        />
                    </Tooltip>
                </ButtonGroup>
            </div>
        );
    }

    private handleSearchInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.props.searchProps?.onSearchQueryChange(evt.target.value);
    };
}
