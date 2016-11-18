/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { ResizeHandle } from "../interactions/resizeHandle";
import { ContextMenuTarget, IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

export interface IRowHeaderCellProps extends IProps {
    /**
     * If true, will apply the active class to the header to indicate it is
     * part of an external operation.
     */
    isActive?: boolean;

    /**
     * Specifies whether the full column is part of a selection.
     */
    isRowSelected?: boolean;

    /**
     * The name displayed in the header of the column.
     */
    name?: string;

    /**
     * An element, like a `<Menu>`, this is displayed by right-clicking
     * anywhere in the header.
     */
    menu?: JSX.Element;

    /**
     * A `ResizeHandle` React component that allows users to drag-resize the
     * header.
     */
    resizeHandle?: ResizeHandle;

    /**
     * CSS styles for the top level element.
     */
    style?: React.CSSProperties;
}

export interface IRowHeaderState {
    isActive: boolean;
}

@ContextMenuTarget
export class RowHeaderCell extends React.Component<IRowHeaderCellProps, IRowHeaderState> {
    public state = {
        isActive: false,
    };

    public render() {
        const { className, isActive, isRowSelected, name, resizeHandle, style } = this.props;
        const classes = classNames(className, "bp-table-header", {
            "bp-table-header-active": isActive || this.state.isActive,
            "bp-table-header-selected": isRowSelected,
        });

        return (
            <div className={classes} style={style}>
                <div className="bp-table-row-name">
                    <div className="bp-table-row-name-text bp-table-truncated-text">
                        {name}
                    </div>
                </div>
                {this.props.children}
                {resizeHandle}
            </div>
        );
    }

    public renderContextMenu(_event: React.MouseEvent<HTMLElement>) {
        return this.props.menu;
    }
}
