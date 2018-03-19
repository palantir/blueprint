/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { AbstractPureComponent, IProps } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { LoadableContent } from "../common/loadableContent";
import { HeaderCell, IHeaderCellProps } from "./headerCell";

export interface IRowHeaderCellProps extends IHeaderCellProps, IProps {
    /**
     * Specifies if the row is reorderable.
     */
    enableRowReordering?: boolean;

    /**
     * Specifies whether the full row is part of a selection.
     */
    isRowSelected?: boolean;
}

export class RowHeaderCell extends AbstractPureComponent<IRowHeaderCellProps, {}> {
    public render() {
        const {
            // from IRowHeaderCellProps
            enableRowReordering,
            isRowSelected,

            // from IHeaderProps
            ...spreadableProps
        } = this.props;

        return (
            <HeaderCell
                isReorderable={this.props.enableRowReordering}
                isSelected={this.props.isRowSelected}
                {...spreadableProps}
            >
                <div className={Classes.TABLE_ROW_NAME}>
                    <LoadableContent loading={spreadableProps.loading}>
                        <div className={Classes.TABLE_ROW_NAME_TEXT}>{spreadableProps.name}</div>
                    </LoadableContent>
                </div>
                {this.props.children}
                {spreadableProps.loading ? undefined : spreadableProps.resizeHandle}
            </HeaderCell>
        );
    }
}
