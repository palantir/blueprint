/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, ContextMenuTarget, IProps } from "@blueprintjs/core";

import { LoadableContent } from "../common/loadableContent";
import { ResizeHandle } from "../interactions/resizeHandle";

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
     * If true, the row `name` will be replaced with a fixed-height skeleton and the `resizeHandle`
     * will not be rendered. If passing in additional children to this component, you will also want
     * to conditionally apply the `.pt-skeleton` class where appropriate.
     * @default false
     */
    loading?: boolean;

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
        const { className, isActive, isRowSelected, loading, name, resizeHandle, style } = this.props;
        const rowHeaderClasses = classNames(className, "bp-table-header", {
            [Classes.LOADING]: loading,
            "bp-table-header-active": isActive || this.state.isActive,
            "bp-table-header-selected": isRowSelected,
        });

        return (
            <div className={rowHeaderClasses} style={style}>
                <div className="bp-table-row-name">
                    <LoadableContent loading={loading}>
                        <div className="bp-table-row-name-text bp-table-truncated-text">
                            {name}
                        </div>
                    </LoadableContent>
                </div>
                {this.props.children}
                {loading ? undefined : resizeHandle}
            </div>
        );
    }

    public renderContextMenu(_event: React.MouseEvent<HTMLElement>) {
        return this.props.menu;
    }
}
