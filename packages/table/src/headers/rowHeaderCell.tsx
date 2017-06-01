/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { IProps } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { LoadableContent } from "../common/loadableContent";
import { HeaderCell, IHeaderCellProps, IInternalHeaderCellProps } from "./headerCell";

export interface IRowHeaderCellProps extends IHeaderCellProps, IProps {
    /**
     * Specifies if the row is reorderable.
     */
    isRowReorderable?: boolean;

    /**
     * Specifies whether the full row is part of a selection.
     */
    isRowSelected?: boolean;
}

export class RowHeaderCell extends React.Component<IRowHeaderCellProps, {}> {
    private static SHALLOWLY_COMPARABLE_PROP_KEYS = [
        "children",
        "className",
        "isActive",
        "isReorderable",
        "isSelected",
        "loading",
        "menu",
        "name",
        "resizeHandle",
    ] as Array<keyof IInternalHeaderCellProps>;

    public render() {
        const loadableContentDivClasses = classNames(
            Classes.TABLE_ROW_NAME_TEXT,
            Classes.TABLE_TRUNCATED_TEXT);

        const {
            // from IRowHeaderCellProps
            isRowReorderable,
            isRowSelected,

            // from IHeaderProps
            ...spreadableProps,
        } = this.props;

        return (
            <HeaderCell
                isReorderable={this.props.isRowReorderable}
                isSelected={this.props.isRowSelected}
                shallowlyComparablePropKeys={RowHeaderCell.SHALLOWLY_COMPARABLE_PROP_KEYS}
                {...spreadableProps}
            >
                <div className={Classes.TABLE_ROW_NAME}>
                    <LoadableContent loading={spreadableProps.loading}>
                        <div className={loadableContentDivClasses}>
                            {spreadableProps.name}
                        </div>
                    </LoadableContent>
                </div>
                {this.props.children}
                {spreadableProps.loading ? undefined : spreadableProps.resizeHandle}
            </HeaderCell>
        );
    }
}
