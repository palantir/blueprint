/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { AbstractComponent, IProps } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import * as Errors from "../common/errors";
import { LoadableContent } from "../common/loadableContent";
import { HeaderCell, IHeaderCellProps } from "./headerCell";

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

export class RowHeaderCell extends AbstractComponent<IRowHeaderCellProps, {}> {
    public render() {
        const {
            // from IRowHeaderCellProps
            isRowReorderable,
            isRowSelected,

            // from IHeaderProps
            ...spreadableProps
        } = this.props;

        return (
            <HeaderCell
                isReorderable={this.props.isRowReorderable}
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

    protected validateProps(nextProps: IRowHeaderCellProps) {
        if (nextProps.menu != null) {
            // throw this warning from the publicly exported, higher-order *HeaderCell components
            // rather than HeaderCell, so consumers know exactly which components are receiving the
            // offending prop
            console.warn(Errors.ROW_HEADER_CELL_MENU_DEPRECATED);
        }
    }
}
