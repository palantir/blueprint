/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import * as React from "react";

import { Button, H6 } from "@blueprintjs/core";

import {
    LISTOGRAM_HEADER,
    LISTOGRAM_HEADER_TITLE,
    LISTOGRAM_SELECTION_DRAWER_BUTTON,
    LISTOGRAM_SORT_DRAWER_BUTTON,
} from "./listogramClasses";
import { ListogramSelectionDrawer } from "./listogramSelectionDrawer";
import type { ListogramSelectionProps } from "./listogramSelectionUtils";
import { ListogramSortDrawer } from "./listogramSortDrawer";
import type { IListogramSortProps } from "./listogramSortUtils";
import { ListogramDrawerKind, type ListogramFormatter } from "./listogramTypes";

export interface IListogramHeaderProps {
    defaultOpenDrawer?: ListogramDrawerKind;
    formatters?: ListogramFormatter;
    hasSubtotals: boolean;
    selectionProps: ListogramSelectionProps | undefined;
    sortProps: IListogramSortProps | undefined;
    title: React.ReactNode;
}

export interface IListogramHeaderState {
    openedDrawer: ListogramDrawerKind | undefined;
}

export class ListogramHeader extends React.PureComponent<IListogramHeaderProps, IListogramHeaderState> {
    constructor(props: IListogramHeaderProps) {
        super(props);
        this.state = {
            openedDrawer: this.props.defaultOpenDrawer,
        };
    }

    public render() {
        const { hasSubtotals, selectionProps, sortProps, title, formatters } = this.props;
        const { openedDrawer } = this.state;

        const enableSorts = sortProps !== undefined;
        const enableSelectionDrawer = selectionProps !== undefined;
        const isSelectionDrawerOpen = openedDrawer === ListogramDrawerKind.SELECTION;
        const isSortDrawerOpen = openedDrawer === ListogramDrawerKind.SORT;

        return (
            <div className={LISTOGRAM_HEADER}>
                <H6 className={LISTOGRAM_HEADER_TITLE}>
                    {title}
                    <div>
                        {enableSelectionDrawer && (
                            <Button
                                active={isSelectionDrawerOpen}
                                className={LISTOGRAM_SELECTION_DRAWER_BUTTON}
                                icon="more"
                                minimal={true}
                                onClick={this.handleSelectionMenuButtonClick}
                            />
                        )}
                        {enableSorts && (
                            <Button
                                active={isSortDrawerOpen}
                                className={LISTOGRAM_SORT_DRAWER_BUTTON}
                                icon="sort"
                                minimal={true}
                                onClick={this.handleSortMenuButtonClick}
                            />
                        )}
                    </div>
                </H6>
                {enableSorts && isSortDrawerOpen && (
                    <ListogramSortDrawer
                        hasSubtotals={hasSubtotals}
                        sortKindLabels={sortProps.sortKindLabels}
                        onSortChange={sortProps.onSortChange}
                        sortDirection={sortProps.sortDirection}
                        sortKind={sortProps.sortKind}
                        areTitlesSortable={sortProps.areTitlesSortable}
                    />
                )}
                {enableSelectionDrawer && isSelectionDrawerOpen && (
                    <ListogramSelectionDrawer formatters={formatters} {...selectionProps} />
                )}
            </div>
        );
    }

    private handleSortMenuButtonClick = () => {
        this.setState(prevState => ({
            openedDrawer: prevState.openedDrawer === ListogramDrawerKind.SORT ? undefined : ListogramDrawerKind.SORT,
        }));
    };

    private handleSelectionMenuButtonClick = () => {
        this.setState(prevState => ({
            openedDrawer:
                prevState.openedDrawer === ListogramDrawerKind.SELECTION ? undefined : ListogramDrawerKind.SELECTION,
        }));
    };
}
