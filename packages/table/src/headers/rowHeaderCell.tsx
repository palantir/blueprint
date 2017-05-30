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
import { AbstractHeaderCell, IHeaderCellProps } from "./abstractHeaderCell";

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
        "isRowReorderable",
        "isRowSelected",
        "name",
        "loading",
        "menu",
        "resizeHandle",
    ];

    public render() {
        const { loading, name, resizeHandle } = this.props;

        const loadableContentDivClasses = classNames(
            Classes.TABLE_ROW_NAME_TEXT,
            Classes.TABLE_TRUNCATED_TEXT);

        return (
            <AbstractHeaderCell
                className={this.props.className}
                isActive={this.props.isActive}
                isReorderable={this.props.isRowReorderable}
                isSelected={this.props.isRowSelected}
                loading={loading}
                menu={this.props.menu}
                name={name}
                resizeHandle={this.props.resizeHandle}
                shallowlyComparablePropKeys={RowHeaderCell.SHALLOWLY_COMPARABLE_PROP_KEYS}
                style={this.props.style}
            >
                <div className={Classes.TABLE_ROW_NAME}>
                    <LoadableContent loading={loading}>
                        <div className={loadableContentDivClasses}>
                            {name}
                        </div>
                    </LoadableContent>
                </div>
                {this.props.children}
                {loading ? undefined : resizeHandle}
            </AbstractHeaderCell>
        );
    }
}
