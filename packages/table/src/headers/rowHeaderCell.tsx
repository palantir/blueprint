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
     * Specifies whether the full column is part of a selection.
     */
    isRowSelected?: boolean;
}

export class RowHeaderCell extends AbstractHeaderCell<IRowHeaderCellProps> {
    public render() {
        const { loading, name, resizeHandle, style } = this.props;

        const loadableContentDivClasses = classNames(
            Classes.TABLE_ROW_NAME_TEXT,
            Classes.TABLE_TRUNCATED_TEXT);

        return (
            <div className={this.getCssClasses()} style={style}>
                <div className={Classes.TABLE_ROW_NAME}>
                    <LoadableContent loading={loading}>
                        <div className={loadableContentDivClasses}>
                            {name}
                        </div>
                    </LoadableContent>
                </div>
                {this.props.children}
                {loading ? undefined : resizeHandle}
            </div>
        );
    }

    protected isReorderable() {
        return this.props.isRowReorderable;
    }

    protected isSelected() {
        return this.props.isRowSelected;
    }

    protected getUpdatePropKeys() {
        // don't include "style" in here because it can't be shallowly compared
        // ordered with children and className first, since these are most likely to change
        return [
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
    }
}
